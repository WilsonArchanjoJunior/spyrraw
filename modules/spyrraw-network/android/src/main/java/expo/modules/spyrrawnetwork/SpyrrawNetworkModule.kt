package expo.modules.spyrrawnetwork

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.Inet4Address
import java.net.InetAddress
import java.nio.ByteOrder

class SpyrrawNetworkModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("SpyrrawNetwork")

        Function("getDhcpDetails") {
            val context = appContext.reactContext ?: return@Function mapOf(
                "gateway" to null,
                "netmask" to null,
                "source" to "unavailable"
            )

            try {
                val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
                val activeNetwork = connectivityManager.activeNetwork
                if (activeNetwork != null) {
                    val linkProperties = connectivityManager.getLinkProperties(activeNetwork)
                    if (linkProperties != null) {
                        var gatewayIp: String? = null
                        var netmaskIp: String? = null

                        for (route in linkProperties.routes) {
                            if (route.isDefaultRoute && route.gateway is Inet4Address) {
                                gatewayIp = route.gateway?.hostAddress
                                break
                            }
                        }

                        for (linkAddress in linkProperties.linkAddresses) {
                            if (linkAddress.address is Inet4Address) {
                                val prefixLength = linkAddress.prefixLength
                                netmaskIp = prefixLengthToNetmask(prefixLength)
                                break
                            }
                        }

                        if (gatewayIp != null || netmaskIp != null) {
                            return@Function mapOf(
                                "gateway" to gatewayIp,
                                "netmask" to netmaskIp,
                                "source" to "link_properties"
                            )
                        }
                    }
                }
            } catch (e: Exception) {
                // Falha silenciosa no ConnectivityManager aciona o fallback de DHCP abaixo
            }

            // Fallback resiliente baseado no DhcpInfo do WifiManager
            try {
                val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as WifiManager
                val dhcpInfo = wifiManager.dhcpInfo
                if (dhcpInfo != null) {
                    return@Function mapOf(
                        "gateway" to intToIp(dhcpInfo.gateway),
                        "netmask" to intToIp(dhcpInfo.netmask),
                        "source" to "dhcp_info"
                    )
                }
            } catch (e: Exception) {}

            mapOf("gateway" to null, "netmask" to null, "source" to "unavailable")
        }

        AsyncFunction("triggerLocalNetworkPermission") {
            // Android gerencia escaneamento local via manifesto (ACCESS_WIFI_STATE).
            // Retorna imediato para manter paridade e fluidez com a API do iOS.
            return@AsyncFunction true
        }
    }

    private fun prefixLengthToNetmask(prefixLength: Int): String {
        var mask = 0xffffffff.toInt() shl (32 - prefixLength)
        val value = byteArrayOf(
            (mask shr 24 and 0xff).toByte(),
            (mask shr 16 and 0xff).toByte(),
            (mask shr 8 and 0xff).toByte(),
            (mask and 0xff).toByte()
        )
        return InetAddress.getByAddress(value).hostAddress ?: "255.255.255.0"
    }

    private fun intToIp(ipInt: Int): String? {
        if (ipInt == 0) return null
        // Correção de Little-Endian: Inverte a ordem dos bytes armazenados no DhcpInfo
        val bytes = if (ByteOrder.nativeOrder() == ByteOrder.LITTLE_ENDIAN) {
            byteArrayOf(
                (ipInt and 0xff).toByte(),
                (ipInt shr 8 and 0xff).toByte(),
                (ipInt shr 16 and 0xff).toByte(),
                (ipInt shr 24 and 0xff).toByte()
            )
        } else {
            byteArrayOf(
                (ipInt shr 24 and 0xff).toByte(),
                (ipInt shr 16 and 0xff).toByte(),
                (ipInt shr 8 and 0xff).toByte(),
                (ipInt and 0xff).toByte()
            )
        }
        return try {
            InetAddress.getByAddress(bytes).hostAddress
        } catch (e: Exception) {
            null
        }
    }
}
