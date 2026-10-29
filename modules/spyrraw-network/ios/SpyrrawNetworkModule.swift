import ExpoModulesCore
import Network
import SystemConfiguration

public class SpyrrawNetworkModule: Module {
  private var bonjourBrowser: NWBrowser?

  public func definition() -> ModuleDefinition {
    Name("SpyrrawNetwork")

    Function("getDhcpDetails") { () -> [String: String?] in
      var gatewayIp: String? = nil
      var netmaskIp: String? = nil
      var source = "unavailable"

      // 1. Captura o Gateway Real através da rota global padrão do iOS
      if let dynamicStore = SCDynamicStoreCreate(nil, "spyrraw" as CFString, nil, nil) {
        if let globalKey = SCDynamicStoreKeyCreateNetworkGlobalEntity(nil, kSCDynamicStoreDomainState, kSCEntNetIPv4),
           let dict = SCDynamicStoreCopyValue(dynamicStore, globalKey) as? [String: Any],
           let router = dict[kSCPropNetIPv4Router] as? String {
            gatewayIp = router
            source = "link_properties"
        }
      }

      // 2. Captura a máscara de sub-rede varrendo as interfaces locais (en0 = Wi-Fi físico)
      var ifaddr: UnsafeMutablePointer<ifaddrs>?
      guard getifaddrs(&ifaddr) == 0 else {
        return ["gateway": gatewayIp, "netmask": nil, "source": source]
      }
      defer { freeifaddrs(ifaddr) }

      var ptr = ifaddr
      while ptr != nil {
        defer { ptr = ptr?.pointee.ifa_next }
        guard let interface = ptr?.pointee else { continue }
        let name = String(cString: interface.ifa_name)
        
        if name == "en0" || name == "en1" { // en0 é o padrão para Wi-Fi em iPhones físicos
          let flags = Int32(interface.ifa_flags)
          var addr = interface.ifa_addr.pointee
          if addr.sa_family == UInt8(AF_INET) {
             if let netmaskAddr = interface.ifa_netmask {
               var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
               if getnameinfo(netmaskAddr, socklen_t(netmaskAddr.pointee.sa_len), &hostname, socklen_t(hostname.count), nil, 0, NI_NUMERICHOST) == 0 {
                 netmaskIp = String(cString: hostname)
                 if source == "unavailable" { source = "dhcp_info" }
               }
             }
             break
          }
        }
      }

      return [
        "gateway": gatewayIp,
        "netmask": netmaskIp,
        "source": source
      ]
    }

    AsyncFunction("triggerLocalNetworkPermission") { (promise: Promise) in
      // Dispara uma busca leve Bonjour para forçar o pop-up nativo de permissão do iOS 14+
      let parameters = NWParameters()
      let descriptor = NWBrowser.Descriptor.bonjour(type: "_spyrraw-probe._tcp", domain: nil)
      let browser = NWBrowser(for: descriptor, using: parameters)
      self.bonjourBrowser = browser

      browser.stateUpdateHandler = { state in
        switch state {
        case .ready:
          promise.resolve(true)
          browser.cancel()
        case .failed(_):
          promise.resolve(false)
          browser.cancel()
        default:
          break
        }
      }

      browser.start(queue: .main)

      // Timeout de segurança de 3 segundos caso o usuário demore para responder ao pop-up
      DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
        if let browserInstance = self.bonjourBrowser {
          promise.resolve(nil) // Retorna nulo/indeterminado se estourar o tempo
          browserInstance.cancel()
          self.bonjourBrowser = nil
        }
      }
    }
  }
}
