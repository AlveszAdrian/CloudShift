(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/hooks/useAwsCredentials.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAwsCredentials": (()=>useAwsCredentials)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useAwsCredentials() {
    _s();
    const [credentials, setCredentials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedCredentialId, setSelectedCredentialId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Function to fetch credentials from the API
    const fetchCredentials = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/aws/credentials');
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                const errorMessage = errorData.error || `Falha ao buscar credenciais: Código ${response.status}`;
                throw new Error(errorMessage);
            }
            const data = await response.json();
            setCredentials(data);
            // If we have credentials but none selected, select the first one
            if (data.length > 0 && !selectedCredentialId) {
                setSelectedCredentialId(data[0].id);
                // Save to localStorage
                localStorage.setItem('selectedAwsCredentialId', data[0].id);
            }
            return data;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Erro ao buscar credenciais: ${errorMessage}`);
            return [];
        } finally{
            setLoading(false);
        }
    };
    // Function to select a credential
    const selectCredential = (id)=>{
        setSelectedCredentialId(id);
        localStorage.setItem('selectedAwsCredentialId', id);
    };
    // Function to add a new credential
    const addCredential = async (credential)=>{
        try {
            setLoading(true);
            setError(null);
            // Criar um objeto com o formato esperado pela API
            const apiCredential = {
                name: credential.name,
                accessKeyId: credential.accessKeyId,
                secretKey: credential.secretAccessKey,
                region: credential.region
            };
            const response = await fetch('/api/aws/credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiCredential)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                const errorMessage = errorData.error || `Falha ao adicionar credencial: Código ${response.status}`;
                throw new Error(errorMessage);
            }
            await fetchCredentials();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Erro ao adicionar credencial: ${errorMessage}`);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Function to update an existing credential
    const updateCredential = async (id, data)=>{
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/aws/credentials/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                const errorMessage = errorData.error || `Falha ao atualizar credencial: Código ${response.status}`;
                throw new Error(errorMessage);
            }
            await fetchCredentials();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Erro ao atualizar credencial: ${errorMessage}`);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Function to delete a credential
    const deleteCredential = async (id)=>{
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/aws/credentials/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                const errorMessage = errorData.error || `Falha ao excluir credencial: Código ${response.status}`;
                throw new Error(errorMessage);
            }
            // If we delete the selected credential, select another one
            if (id === selectedCredentialId) {
                const remainingCredentials = credentials.filter((c)=>c.id !== id);
                if (remainingCredentials.length > 0) {
                    selectCredential(remainingCredentials[0].id);
                } else {
                    setSelectedCredentialId(null);
                    localStorage.removeItem('selectedAwsCredentialId');
                }
            }
            await fetchCredentials();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Erro ao excluir credencial: ${errorMessage}`);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    // Load credentials on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAwsCredentials.useEffect": ()=>{
            // Try to restore selected credential from localStorage
            const savedCredentialId = localStorage.getItem('selectedAwsCredentialId');
            if (savedCredentialId) {
                setSelectedCredentialId(savedCredentialId);
            }
            fetchCredentials();
        }
    }["useAwsCredentials.useEffect"], []);
    // Find the selected credential object
    const selectedCredential = credentials.find((c)=>c.id === selectedCredentialId) || null;
    return {
        credentials,
        selectedCredential,
        selectCredential,
        addCredential,
        updateCredential,
        deleteCredential,
        loading,
        isLoading: loading,
        error,
        refresh: fetchCredentials
    };
}
_s(useAwsCredentials, "GmzQsCpeqQYlsGTjGI93W9Id++M=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/hooks/useAlerts.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useAlerts": (()=>useAlerts)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAwsCredentials.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function useAlerts() {
    _s();
    const { selectedCredential } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwsCredentials"])();
    const [alerts, setAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const fetchAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAlerts.useCallback[fetchAlerts]": async ()=>{
            try {
                setLoading(true);
                setError(null);
                let url = "/api/alerts";
                const params = new URLSearchParams();
                if (filters.status) {
                    params.append("status", filters.status);
                }
                if (filters.severity) {
                    params.append("severity", filters.severity);
                }
                if (filters.resourceType) {
                    params.append("resourceType", filters.resourceType);
                }
                // Use the selected credential or a specific credentialId from filters
                const credentialId = filters.credentialId || selectedCredential?.id;
                if (credentialId) {
                    params.append("credentialId", credentialId);
                }
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
                console.log('Buscando alertas em:', url);
                const response = await fetch(url);
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error || "Erro ao buscar alertas");
                }
                const data = await response.json();
                console.log('Alertas recebidos:', data.alerts?.length || 0);
                setAlerts(data.alerts || []);
            } catch (err) {
                console.error('Erro ao buscar alertas:', err);
                setError(err instanceof Error ? err.message : "Erro ao buscar alertas");
            } finally{
                setLoading(false);
            }
        }
    }["useAlerts.useCallback[fetchAlerts]"], [
        filters,
        selectedCredential
    ]);
    const updateAlertStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAlerts.useCallback[updateAlertStatus]": async (id, action)=>{
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("/api/alerts", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id,
                        action
                    })
                });
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error || `Erro ao ${action === "dismiss" ? "arquivar" : "resolver"} alerta`);
                }
                // Atualizar lista de alertas
                await fetchAlerts();
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : `Erro ao ${action === "dismiss" ? "arquivar" : "resolver"} alerta`);
                return false;
            } finally{
                setLoading(false);
            }
        }
    }["useAlerts.useCallback[updateAlertStatus]"], [
        fetchAlerts
    ]);
    const dismissAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAlerts.useCallback[dismissAlert]": (id)=>{
            return updateAlertStatus(id, "dismiss");
        }
    }["useAlerts.useCallback[dismissAlert]"], [
        updateAlertStatus
    ]);
    const resolveAlert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAlerts.useCallback[resolveAlert]": (id)=>{
            return updateAlertStatus(id, "resolve");
        }
    }["useAlerts.useCallback[resolveAlert]"], [
        updateAlertStatus
    ]);
    // Buscar alertas ao montar o componente ou quando os filtros ou a credencial selecionada mudarem
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAlerts.useEffect": ()=>{
            fetchAlerts();
        }
    }["useAlerts.useEffect"], [
        fetchAlerts,
        selectedCredential
    ]);
    return {
        alerts,
        loading,
        error,
        filters,
        setFilters,
        fetchAlerts,
        dismissAlert,
        resolveAlert
    };
}
_s(useAlerts, "dLVmkSK5Oq1oQ8kMp5Smk5Q+VDQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwsCredentials"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/dashboard/security/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SecurityPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAlerts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAwsCredentials.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-client] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eraser.js [app-client] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$slash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Slash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/slash.js [app-client] (ecmascript) <export default as Slash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/octagon-alert.js [app-client] (ecmascript) <export default as AlertOctagon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key.js [app-client] (ecmascript) <export default as Key>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/LineChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Line.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
// Remove the entire neon styles section
// Replace with more simple vibrant color styles
const colorStyles = `
  /* Vibrant color effects */
  .text-effect-red {
    color: #ef4444;
  }
  .text-effect-orange {
    color: #f97316;
  }
  .text-effect-yellow {
    color: #eab308;
  }
  .text-effect-blue {
    color: #3b82f6;
  }
  .text-effect-violet {
    color: #8b5cf6;
  }
  .text-effect-green {
    color: #22c55e;
  }
  .text-effect-gray {
    color: #9ca3af;
  }
  .text-effect-indigo {
    color: #6366f1;
  }
  .text-effect-cyan {
    color: #06b6d4;
  }

  /* Button hover effects */
  .button-effect-indigo {
    transition: all 0.2s ease;
  }
  .button-effect-indigo:hover {
    background-color: rgba(99, 102, 241, 0.7);
  }
  
  .button-effect-green {
    transition: all 0.2s ease;
  }
  .button-effect-green:hover {
    background-color: rgba(34, 197, 94, 0.7);
  }
  
  .button-effect-gray {
    transition: all 0.2s ease;
  }
  .button-effect-gray:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  
  /* Destaque para novos alertas */
  @keyframes highlightPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  
  .highlight-pulse {
    animation: highlightPulse 1.5s ease-in-out 3;
    border: 1px solid rgba(239, 68, 68, 0.7);
    transition: all 0.3s ease;
  }
`;
// Add missing function for status badge colors
const getStatusBadgeColor = (status)=>{
    switch(status){
        case 'OPEN':
        case 'active':
            return 'bg-blue-100 text-blue-800';
        case 'IN_PROGRESS':
            return 'bg-yellow-100 text-yellow-800';
        case 'RESOLVED':
            return 'bg-green-100 text-green-800';
        case 'DISMISSED':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
// Add LineGraph component since it's missing
const LineGraph = ({ data, xKey, yKey, xLabel, yLabel, color })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
        width: "100%",
        height: "100%",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$LineChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LineChart"], {
            data: data,
            margin: {
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                    strokeDasharray: "3 3"
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                    dataKey: xKey,
                    label: {
                        value: xLabel,
                        position: 'insideBottom',
                        offset: -5
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 175,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                    label: {
                        value: yLabel,
                        angle: -90,
                        position: 'insideLeft'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 177,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                    type: "monotone",
                    dataKey: yKey,
                    stroke: color,
                    activeDot: {
                        r: 8
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/dashboard/security/page.tsx",
            lineNumber: 165,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/dashboard/security/page.tsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
};
_c = LineGraph;
function SecurityPage() {
    _s();
    const { selectedCredential } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwsCredentials"])();
    const { alerts, loading, error, filters, setFilters, dismissAlert, resolveAlert, fetchAlerts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAlerts"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const categoryParam = searchParams.get('category');
    // Ref para controlar o ciclo de scans completos
    const cyclesToFullScan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(10); // Iniciar com 10 ciclos (5 minutos)
    const [cleanupLoading, setCleanupLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cleanupMessage, setCleanupMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCleanupMessage, setShowCleanupMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [iamScanLoading, setIamScanLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [ec2CleanupLoading, setEc2CleanupLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [iamScanMessage, setIamScanMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showIamScanMessage, setShowIamScanMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all'); // 'all', 'iam', 'ec2', etc.
    const [timeRange, setTimeRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('week');
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    const [expandedSections, setExpandedSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [severityFilters, setSeverityFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        'CRITICAL': true,
        'HIGH': true,
        'MEDIUM': true,
        'LOW': true,
        'INFO': true
    });
    const [statusFilters, setStatusFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        'OPEN': true,
        'IN_PROGRESS': true,
        'RESOLVED': true,
        'DISMISSED': false
    });
    // Estado para controlar o modal de detalhes do alerta
    const [alertDetailsModal, setSelectedAlert] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showModal, setShowModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Estados para atualização em tempo real
    const [autoRefresh, setAutoRefresh] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [refreshInterval, setRefreshInterval] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(30); // segundos
    const [lastAlertId, setLastAlertId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newAlertsCount, setNewAlertsCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [newAlerts, setNewAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [highlightedAlerts, setHighlightedAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Estado para controlar verificações iniciais
    const [initialScanCompleted, setInitialScanCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Adicionar um estado para gerenciar os alertas localmente
    const [localAlerts, setLocalAlerts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Estado para controlar a visibilidade do menu de configuração de auto refresh
    const [showRefreshMenu, setShowRefreshMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Estado para controlar o escaneamento de vulnerabilidades
    const [scanning, setScanningUnified] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Estado para filtrar alertas por severidade
    const [severityFilter, setSeverityFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'CRITICAL',
        'HIGH',
        'MEDIUM',
        'LOW'
    ]);
    // Função para alternar a exibição do menu de refresh
    const toggleRefreshMenu = (e)=>{
        e.stopPropagation(); // Prevenir que o clique afete o botão de auto refresh
        setShowRefreshMenu((prev)=>!prev);
    };
    // Função para configurar o intervalo de refresh
    const setRefreshRate = (seconds)=>{
        setRefreshInterval(seconds);
        setShowRefreshMenu(false);
        // Reiniciar o ciclo com o novo intervalo
        if (autoRefresh) {
            // Feedback visual da alteração
            setCleanupMessage(`Intervalo de atualização alterado para ${seconds} segundos`);
            setShowCleanupMessage(true);
            setTimeout(()=>{
                setShowCleanupMessage(false);
            }, 3000);
        }
    };
    // Função para alternar o filtro de severidade
    const toggleSeverityFilter = (severity)=>{
        if (severityFilter.includes(severity)) {
            setSeverityFilter(severityFilter.filter((s)=>s !== severity));
        } else {
            setSeverityFilter([
                ...severityFilter,
                severity
            ]);
        }
    };
    // Fechar o menu quando clicar fora dele
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            const handleClickOutside = {
                "SecurityPage.useEffect.handleClickOutside": ()=>{
                    if (showRefreshMenu) {
                        setShowRefreshMenu(false);
                    }
                }
            }["SecurityPage.useEffect.handleClickOutside"];
            // Adicionar o handler apenas quando o menu estiver aberto
            if (showRefreshMenu) {
                document.addEventListener('click', handleClickOutside);
            }
            return ({
                "SecurityPage.useEffect": ()=>{
                    document.removeEventListener('click', handleClickOutside);
                }
            })["SecurityPage.useEffect"];
        }
    }["SecurityPage.useEffect"], [
        showRefreshMenu
    ]);
    // Atualizar useEffect para sincronizar os alertas da API com os alertas locais
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            // Se não há credencial, limpar alertas
            if (!selectedCredential?.id) {
                setLocalAlerts([]);
                setLastAlertId(null);
                return;
            }
            // Substitui completamente os alertas locais com os alertas da API
            // Isso é seguro aqui porque estamos obtendo a lista completa da API
            setLocalAlerts(alerts);
            // Se houver alertas, armazena o ID do mais recente
            if (alerts.length > 0 && !lastAlertId) {
                setLastAlertId(alerts[0].id);
            }
        }
    }["SecurityPage.useEffect"], [
        alerts,
        lastAlertId,
        selectedCredential
    ]);
    // Função para fechar o modal
    const closeModal = ()=>{
        setShowModal(false);
        setSelectedAlert(null);
    };
    // Função para abrir o modal com o alerta selecionado
    const openAlertDetails = (alert)=>{
        // Prevenção defensiva - não abrir se não tiver dados
        if (!alert || !alert.id) {
            console.error("Tentativa de abrir modal com alerta inválido:", alert);
            return;
        }
        // Definir primeiro o alerta e depois o estado do modal para garantir que os dados estejam prontos
        setSelectedAlert(alert);
        // Usar um setTimeout para garantir que o setSelectedAlert seja processado primeiro
        setTimeout(()=>{
            setShowModal(true);
            console.log("Modal aberto para alerta:", alert.id); // Log para debugging
        }, 10);
    };
    // Função para fechar o modal com detalhes do alerta
    const handleCloseModal = (e)=>{
        // Se o evento foi passado, impedir a propagação
        if (e) {
            e.stopPropagation();
        }
        // Fechar o modal primeiro, depois limpar o alerta selecionado
        setShowModal(false);
        // Atrasar a limpeza do alerta selecionado para evitar flashes visuais
        setTimeout(()=>{
            setSelectedAlert(null);
        }, 300); // Tempo suficiente para a animação de fechamento
    };
    // Corrigir a função checkForNewAlerts para usar o estado localAlerts e tipar corretamente as variáveis
    const checkForNewAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SecurityPage.useCallback[checkForNewAlerts]": async ()=>{
            if (!autoRefresh || loading) return;
            // Se não há credencial selecionada, limpar os alertas em vez de tentar buscar
            if (!selectedCredential?.id) {
                // Limpar os alertas quando a credencial é removida
                if (localAlerts.length > 0) {
                    setLocalAlerts([]);
                    setLastAlertId(null);
                    setNewAlertsCount(0);
                    setCleanupMessage("Credencial AWS removida. Os alertas foram limpos.");
                    setShowCleanupMessage(true);
                }
                return;
            }
            try {
                // Construir a URL com os mesmos filtros que estão sendo usados atualmente
                let url = "/api/alerts";
                const params = new URLSearchParams();
                // Adicionar os filtros atuais
                if (activeCategory !== 'all') {
                    params.append("resourceType", activeCategory);
                }
                // Adicionar o ID da credencial selecionada
                params.append("credentialId", selectedCredential.id);
                // Se temos um último alerta conhecido, pegamos apenas os mais recentes que esse
                if (lastAlertId) {
                    params.append("after_id", lastAlertId);
                }
                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
                const response = await fetch(url);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Falha ao verificar novos alertas");
                }
                const data = await response.json();
                // Verificar se data.alerts existe para evitar erros de tipo
                if (!data || !Array.isArray(data.alerts)) {
                    console.error("Formato inesperado de resposta:", data);
                    throw new Error("Formato de resposta inválido");
                }
                const freshAlerts = data.alerts;
                if (freshAlerts.length > 0) {
                    // Armazenar o ID do alerta mais recente
                    setLastAlertId(freshAlerts[0].id);
                    setNewAlertsCount({
                        "SecurityPage.useCallback[checkForNewAlerts]": (prev)=>prev + freshAlerts.length
                    }["SecurityPage.useCallback[checkForNewAlerts]"]);
                    // Adicionar novos alertas no topo da lista, evitando duplicatas
                    setLocalAlerts({
                        "SecurityPage.useCallback[checkForNewAlerts]": (prev)=>{
                            // Criar um Set com os IDs dos alertas atuais para verificação rápida
                            const existingIds = new Set(prev.map({
                                "SecurityPage.useCallback[checkForNewAlerts]": (alert)=>alert.id
                            }["SecurityPage.useCallback[checkForNewAlerts]"]));
                            // Filtrar apenas os alertas que não existem na lista atual
                            const uniqueNewAlerts = freshAlerts.filter({
                                "SecurityPage.useCallback[checkForNewAlerts].uniqueNewAlerts": (alert)=>!existingIds.has(alert.id)
                            }["SecurityPage.useCallback[checkForNewAlerts].uniqueNewAlerts"]);
                            // Retornar a nova lista combinada, sem duplicatas
                            return [
                                ...uniqueNewAlerts,
                                ...prev
                            ];
                        }
                    }["SecurityPage.useCallback[checkForNewAlerts]"]);
                    // Marcar os novos alertas para destacar
                    setHighlightedAlerts(freshAlerts.map({
                        "SecurityPage.useCallback[checkForNewAlerts]": (alert)=>alert.id
                    }["SecurityPage.useCallback[checkForNewAlerts]"]));
                    // Remover o destaque após 5 segundos
                    setTimeout({
                        "SecurityPage.useCallback[checkForNewAlerts]": ()=>{
                            setHighlightedAlerts([]);
                        }
                    }["SecurityPage.useCallback[checkForNewAlerts]"], 5000);
                }
            } catch (error) {
                console.error("Erro ao verificar novos alertas:", error);
                // Não mostrar o erro para o usuário se for devido à credencial ter sido removida
                if (selectedCredential?.id) {
                    setCleanupMessage(`Erro ao verificar alertas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                    setShowCleanupMessage(true);
                }
            }
        }
    }["SecurityPage.useCallback[checkForNewAlerts]"], [
        autoRefresh,
        loading,
        lastAlertId,
        activeCategory,
        selectedCredential,
        localAlerts.length
    ]);
    // Função modificada para verificar ameaças de EC2 em segundo plano
    const handleScanEC2Threats = async ()=>{
        if (!selectedCredential) {
            setCleanupMessage("Selecione uma credencial AWS para realizar a verificação");
            setShowCleanupMessage(true);
            return;
        }
        // Mostrar notificação de início do scan em background
        setCleanupMessage("Verificação de EC2 iniciada em segundo plano. Você será notificado quando estiver completa.");
        setShowCleanupMessage(true);
        // Definir flag para evitar escaneamentos duplicados
        let scanInProgress = true;
        // Função que será executada de forma assíncrona em segundo plano
        const runBackgroundScan = async ()=>{
            try {
                // Não bloqueamos a UI com setEC2CleanupLoading mais
                // Apenas executamos o scan em background
                const response = await fetch('/api/alerts/ec2/scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        credentialId: selectedCredential.id,
                        skipExisting: true // Ignorar alertas já existentes
                    })
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Erro ao verificar ameaças do EC2');
                }
                const result = await response.json();
                // Quando o scan terminar, atualizar os alertas sem interromper a UI
                await fetchAlerts();
                // Exibir notificação suave com resultado
                setCleanupMessage(`Verificação de EC2 concluída: ${result.alertsCreated} novos alertas encontrados.`);
                setShowCleanupMessage(true);
                // Se encontrou novos alertas, mostra highlights
                if (result.alertsCreated > 0) {
                    // Apenas recarregar se encontrou novos alertas
                    setNewAlertsCount((prev)=>prev + result.alertsCreated);
                    // Destacar novos alertas apenas se estiver na categoria EC2
                    if (activeCategory === 'ec2' || activeCategory === 'all') {
                        // Atualizar a UI delicadamente
                        setTimeout(()=>{
                            // Buscar apenas os novos alertas para adicionar aos atuais sem recarregar tudo
                            checkForNewAlerts();
                        }, 500);
                    }
                }
            } catch (error) {
                console.error("Erro no scan de EC2 em background:", error);
                setCleanupMessage(`Erro na verificação de EC2 em segundo plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                setShowCleanupMessage(true);
            } finally{
                scanInProgress = false;
            }
        };
        // Executar o scan em segundo plano
        runBackgroundScan();
    };
    // Modificar a função de verificação IAM para executar em segundo plano
    const performIAMScan = async (skipExisting = false)=>{
        if (!selectedCredential) {
            setIamScanMessage("Selecione uma credencial AWS para realizar a verificação");
            setShowIamScanMessage(true);
            return;
        }
        // Mostrar notificação de início do scan em background
        setIamScanMessage("Verificação de IAM iniciada em segundo plano. Você será notificado quando estiver completa.");
        setShowIamScanMessage(true);
        // Definir flag para evitar escaneamentos duplicados
        let scanInProgress = true;
        // Função que será executada de forma assíncrona em segundo plano
        const runBackgroundScan = async ()=>{
            try {
                // Não bloqueamos a UI com setIamScanLoading mais
                // Apenas executamos o scan em background
                const response = await fetch('/api/alerts/iam', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        credentialId: selectedCredential.id,
                        skipExisting: skipExisting // Parâmetro para ignorar alertas existentes
                    })
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Erro ao verificar ameaças do IAM');
                }
                const result = await response.json();
                // Quando o scan terminar, atualizar os alertas sem interromper a UI
                await fetchAlerts();
                // Exibir notificação suave com resultado
                setIamScanMessage(`Verificação de IAM concluída: ${result.alertsCreated} novos alertas encontrados.`);
                setShowIamScanMessage(true);
                // Se encontrou novos alertas, mostra highlights
                if (result.alertsCreated > 0) {
                    // Apenas recarregar se encontrou novos alertas
                    setNewAlertsCount((prev)=>prev + result.alertsCreated);
                    // Destacar novos alertas apenas se estiver na categoria IAM
                    if (activeCategory === 'iam' || activeCategory === 'all') {
                        // Atualizar a UI delicadamente
                        setTimeout(()=>{
                            // Buscar apenas os novos alertas para adicionar aos atuais sem recarregar tudo
                            checkForNewAlerts();
                        }, 500);
                    }
                }
            } catch (error) {
                console.error("Erro no scan de IAM em background:", error);
                setIamScanMessage(`Erro na verificação de IAM em segundo plano: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                setShowIamScanMessage(true);
            } finally{
                scanInProgress = false;
            }
        };
        // Executar o scan em segundo plano
        runBackgroundScan();
    };
    // Atualizar a função handleScanIAMThreats para usar a nova função
    const handleScanIAMThreats = async ()=>{
        await performIAMScan(false); // Sem pular existentes quando acionado manualmente
    };
    // Configurar o intervalo para verificar novos alertas e executar scans periódicos
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            if (!autoRefresh) return;
            // Função para realizar um ciclo completo de verificação
            const runCompleteCycle = {
                "SecurityPage.useEffect.runCompleteCycle": async ()=>{
                    // Se não há credencial selecionada, limpar alertas e sair
                    if (!selectedCredential?.id) {
                        // Limpar os alertas quando não há credencial
                        if (localAlerts.length > 0) {
                            setLocalAlerts([]);
                            setLastAlertId(null);
                            setNewAlertsCount(0);
                        }
                        return;
                    }
                    // Primeiro verificar novos alertas (operação leve)
                    await checkForNewAlerts();
                    // A cada 5 minutos (10 ciclos de 30s), executar um scan completo se tivermos uma credencial
                    if (selectedCredential?.id) {
                        // Usar um contador de ciclos armazenado em uma ref para controlar quando fazer scans completos
                        cyclesToFullScan.current -= 1;
                        // Exibir contagem regressiva quando faltar pouco para o próximo scan
                        if (cyclesToFullScan.current <= 3 && cyclesToFullScan.current > 0) {
                            console.log(`Próximo scan automático em ${cyclesToFullScan.current * 30} segundos...`);
                        }
                        if (cyclesToFullScan.current <= 0) {
                            console.log("Executando scan automático em segundo plano...");
                            // Executar um scan periódico usando fetch direto em vez de chamar runUnifiedBackgroundScan
                            try {
                                // Mostrar notificação de início do scan em background
                                setCleanupMessage("Verificação automática de segurança iniciada. Você será notificado quando novos alertas forem encontrados.");
                                setShowCleanupMessage(true);
                                const response = await fetch('/api/alerts/scan', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        credentialId: selectedCredential.id,
                                        skipExisting: true // Pular alertas existentes em scans automáticos
                                    })
                                });
                                if (!response.ok) {
                                    throw new Error('Falha na verificação automática');
                                }
                                // Atualizar a mensagem para indicar que o scan foi iniciado com sucesso
                                setCleanupMessage("Verificação automática iniciada com sucesso. Monitorando alertas...");
                                setShowCleanupMessage(true);
                                // Configurar verificações periódicas para novos alertas após iniciar o scan
                                const scanCheckInterval = setInterval({
                                    "SecurityPage.useEffect.runCompleteCycle.scanCheckInterval": async ()=>{
                                        // Cancelar o intervalo se a credencial for removida
                                        if (!selectedCredential?.id) {
                                            clearInterval(scanCheckInterval);
                                            return;
                                        }
                                        const previousCount = newAlertsCount;
                                        await checkForNewAlerts();
                                        // Se encontramos novos alertas, informar o usuário
                                        if (newAlertsCount > previousCount) {
                                            setCleanupMessage(`Novos alertas de segurança encontrados (${newAlertsCount - previousCount})! Verificação continua em segundo plano.`);
                                            setShowCleanupMessage(true);
                                            // Reproduzir um som ou fazer um flash na tela para chamar atenção (opcional)
                                            // document.getElementById('alert-sound')?.play();
                                            // Destacar a área de novos alertas
                                            const alertsSection = document.querySelector('.alerts-section');
                                            if (alertsSection) {
                                                alertsSection.classList.add('highlight-pulse');
                                                setTimeout({
                                                    "SecurityPage.useEffect.runCompleteCycle.scanCheckInterval": ()=>{
                                                        alertsSection.classList.remove('highlight-pulse');
                                                    }
                                                }["SecurityPage.useEffect.runCompleteCycle.scanCheckInterval"], 3000);
                                            }
                                        }
                                    }
                                }["SecurityPage.useEffect.runCompleteCycle.scanCheckInterval"], 5000); // Verificar a cada 5 segundos durante 1 minuto
                                // Limpar o intervalo após um tempo razoável (60 segundos)
                                setTimeout({
                                    "SecurityPage.useEffect.runCompleteCycle": ()=>{
                                        clearInterval(scanCheckInterval);
                                        // Não executar se a credencial foi removida
                                        if (!selectedCredential?.id) return;
                                        // Verificação final
                                        checkForNewAlerts();
                                        if (newAlertsCount > 0) {
                                            setCleanupMessage(`Verificação automática concluída. ${newAlertsCount} novos alertas foram encontrados e carregados.`);
                                        } else {
                                            setCleanupMessage("Verificação automática concluída. Nenhum novo alerta encontrado.");
                                        }
                                        setShowCleanupMessage(true);
                                        // Reiniciar o contador após um scan bem-sucedido
                                        cyclesToFullScan.current = 10; // 10 ciclos de 30s = 5 minutos
                                    }
                                }["SecurityPage.useEffect.runCompleteCycle"], 60000);
                            } catch (error) {
                                console.error("Erro ao executar scan automático:", error);
                                // Não mostrar o erro para o usuário se for devido à credencial ter sido removida
                                if (selectedCredential?.id) {
                                    setCleanupMessage(`Erro na verificação automática: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                                    setShowCleanupMessage(true);
                                }
                                // Ainda reseta o contador, mas com valor menor para tentar novamente mais cedo
                                cyclesToFullScan.current = 4; // Tentar novamente em 2 minutos
                            }
                        }
                    }
                }
            }["SecurityPage.useEffect.runCompleteCycle"];
            // Executar imediatamente na primeira vez
            runCompleteCycle();
            // Configurar o intervalo
            const intervalId = setInterval(runCompleteCycle, refreshInterval * 1000);
            return ({
                "SecurityPage.useEffect": ()=>clearInterval(intervalId)
            })["SecurityPage.useEffect"];
        }
    }["SecurityPage.useEffect"], [
        autoRefresh,
        refreshInterval,
        checkForNewAlerts,
        selectedCredential,
        newAlertsCount,
        localAlerts.length
    ]);
    // Resetar contador de novos alertas quando o usuário visualiza a página
    const resetNewAlertsCounter = ()=>{
        setNewAlertsCount(0);
    };
    // Limpar os indicadores de novos alertas quando o usuário interage com a página
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            window.addEventListener('click', resetNewAlertsCounter);
            return ({
                "SecurityPage.useEffect": ()=>{
                    window.removeEventListener('click', resetNewAlertsCounter);
                }
            })["SecurityPage.useEffect"];
        }
    }["SecurityPage.useEffect"], []);
    // Atualizar manualmente e limpar o contador
    const handleManualRefresh = async ()=>{
        resetNewAlertsCounter();
        // Limpa o estado anterior para evitar potencial duplicação
        setLocalAlerts([]);
        await fetchAlerts();
        if (alerts.length > 0) {
            setLastAlertId(alerts[0].id);
        }
    };
    // Alternar atualização automática
    const toggleAutoRefresh = ()=>{
        setAutoRefresh((prev)=>!prev);
    };
    // Modificar a verificação automática ao carregar a página para usar o scan unificado
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            // Carregar alertas existentes primeiro
            const initPage = {
                "SecurityPage.useEffect.initPage": async ()=>{
                    await fetchAlerts();
                    // Armazenar o ID do alerta mais recente, se houver
                    if (alerts.length > 0) {
                        setLastAlertId(alerts[0].id);
                    }
                    // Verificar se já completou a verificação inicial para evitar duplicações
                    // E também verificar se há uma credencial válida selecionada
                    if (selectedCredential && selectedCredential.id && !initialScanCompleted) {
                        // Realizar verificação unificada em segundo plano sem bloquear a UI
                        console.log("Agendando verificação unificada inicial em segundo plano...");
                        // Usamos setTimeout para garantir que a UI seja carregada primeiro
                        setTimeout({
                            "SecurityPage.useEffect.initPage": ()=>{
                                // Iniciar o scan unificado em background
                                runUnifiedBackgroundScan(true);
                                // Marcar que a verificação inicial foi agendada
                                setInitialScanCompleted(true);
                            }
                        }["SecurityPage.useEffect.initPage"], 1000); // Iniciar após 1 segundo de carregamento da UI
                    }
                }
            }["SecurityPage.useEffect.initPage"];
            initPage();
        }
    }["SecurityPage.useEffect"], [
        selectedCredential
    ]);
    // Nova função unificada para executar scan em background usando o endpoint unificado
    const runUnifiedBackgroundScan = async (skipExisting = true)=>{
        if (!selectedCredential || !selectedCredential.id) {
            setCleanupMessage("Selecione uma credencial AWS para realizar a verificação");
            setShowCleanupMessage(true);
            return;
        }
        // Mostrar notificação de início do scan em background
        setCleanupMessage("Verificação de segurança unificada iniciada em segundo plano. Você será notificado quando novos alertas forem encontrados.");
        setShowCleanupMessage(true);
        try {
            const response = await fetch('/api/alerts/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    credentialId: selectedCredential.id,
                    skipExisting: skipExisting
                })
            });
            if (!response.ok) {
                const data = await response.json();
                if (response.status === 401) {
                    setCleanupMessage(`Erro de credenciais: ${data.error || 'Credenciais AWS inválidas ou com permissões insuficientes'}`);
                    setShowCleanupMessage(true);
                    return;
                }
                throw new Error(data.error || 'Erro ao iniciar verificação de segurança unificada');
            }
            const result = await response.json();
            console.log("Scan unificado iniciado:", result);
            // Configurar um intervalo para verificar novos alertas periodicamente
            // sem precisar esperar pelo término do scan
            const checkInterval = setInterval(async ()=>{
                const previousCount = newAlertsCount;
                await checkForNewAlerts();
                // Se encontramos novos alertas, informar o usuário
                if (newAlertsCount > previousCount) {
                    setCleanupMessage(`Novos alertas de segurança encontrados (${newAlertsCount - previousCount}). A verificação continua em segundo plano.`);
                    setShowCleanupMessage(true);
                }
            }, 5000); // Verificar a cada 5 segundos
            // Limpar o intervalo após um tempo razoável (2 minutos)
            setTimeout(()=>{
                clearInterval(checkInterval);
                // Verificação final
                checkForNewAlerts();
                setCleanupMessage("Verificação de segurança concluída. Todos os novos alertas foram carregados.");
                setShowCleanupMessage(true);
            }, 120000);
        } catch (error) {
            console.error("Erro ao iniciar scan unificado:", error);
            setCleanupMessage(`Erro ao iniciar verificação unificada: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
            setShowCleanupMessage(true);
        }
    };
    // Função para determinar a categoria de um alerta com base no tipo de recurso
    const getAlertCategory = (resourceType)=>{
        if (resourceType.startsWith('IAM') || resourceType === 'SecretManagerSecret') {
            return 'iam';
        } else if (resourceType.startsWith('EC2') || resourceType === 'SecurityGroup' || resourceType === 'Volume' || resourceType === 'VPC' || resourceType.includes('Gateway') || resourceType === 'Subnet' || resourceType === 'RouteTable' || resourceType === 'NetworkInterface' || resourceType === 'ElasticIP' || resourceType === 'NetworkACL' || resourceType.includes('ACL')) {
            return 'ec2';
        } else if (resourceType.startsWith('S3') || resourceType.includes('Bucket')) {
            return 's3';
        } else if (resourceType.startsWith('RDS') || resourceType.startsWith('DB') || resourceType.includes('Database')) {
            return 'rds';
        } else if (resourceType.startsWith('DynamoDB') || resourceType.includes('DynamoDB')) {
            return 'dynamodb';
        } else if (resourceType.startsWith('Lambda')) {
            return 'lambda';
        }
        // Log tipos desconhecidos para depuração
        console.log('Tipo de recurso não categorizado:', resourceType);
        return 'other';
    };
    // Set initial category from URL parameter
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            if (categoryParam) {
                setActiveCategory(categoryParam);
            }
        }
    }["SecurityPage.useEffect"], [
        categoryParam
    ]);
    // Effect to show notification messages when they're set
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            if (cleanupMessage) setShowCleanupMessage(true);
            if (iamScanMessage) setShowIamScanMessage(true);
        }
    }["SecurityPage.useEffect"], [
        cleanupMessage,
        iamScanMessage
    ]);
    // Effect to load alerts when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            fetchAlerts();
        }
    }["SecurityPage.useEffect"], [
        fetchAlerts
    ]);
    const activeAlerts = alerts.filter((a)=>a.status === 'active' || a.status === 'OPEN');
    const criticalAlerts = activeAlerts.filter((a)=>a.severity === 'CRITICAL');
    const highAlerts = activeAlerts.filter((a)=>a.severity === 'HIGH');
    const mediumAlerts = activeAlerts.filter((a)=>a.severity === 'MEDIUM');
    const lowAlerts = activeAlerts.filter((a)=>a.severity === 'LOW');
    // Função auxiliar para remover duplicatas de alertas com base no ID
    const removeDuplicateAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SecurityPage.useCallback[removeDuplicateAlerts]": (alertsList)=>{
            const uniqueAlerts = new Map();
            // Usa um Map para garantir que cada ID aparece apenas uma vez
            // Se houver duplicatas, a última ocorrência será mantida
            alertsList.forEach({
                "SecurityPage.useCallback[removeDuplicateAlerts]": (alert)=>{
                    uniqueAlerts.set(alert.id, alert);
                }
            }["SecurityPage.useCallback[removeDuplicateAlerts]"]);
            return Array.from(uniqueAlerts.values());
        }
    }["SecurityPage.useCallback[removeDuplicateAlerts]"], []);
    // Usar localAlerts em vez de alerts na renderização da lista
    const filteredAlerts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SecurityPage.useMemo[filteredAlerts]": ()=>{
            // Primeiro remove quaisquer duplicatas que possam existir
            const uniqueAlerts = removeDuplicateAlerts(localAlerts);
            // Em seguida, aplica os filtros
            return uniqueAlerts.filter({
                "SecurityPage.useMemo[filteredAlerts]": (alert)=>{
                    // Filter by category
                    if (activeCategory !== 'all' && getAlertCategory(alert.resourceType) !== activeCategory) {
                        return false;
                    }
                    // Filter by search term
                    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && !alert.description.toLowerCase().includes(searchTerm.toLowerCase()) && !alert.resourceId.toLowerCase().includes(searchTerm.toLowerCase()) && !alert.resourceType.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return false;
                    }
                    // Filter by severity
                    if (!severityFilters[alert.severity]) {
                        return false;
                    }
                    // Filter by status (normalize 'active' to 'OPEN' for consistency)
                    const normalizedStatus = alert.status === 'active' ? 'OPEN' : alert.status;
                    if (!statusFilters[normalizedStatus]) {
                        return false;
                    }
                    return true;
                }
            }["SecurityPage.useMemo[filteredAlerts]"]);
        }
    }["SecurityPage.useMemo[filteredAlerts]"], [
        localAlerts,
        activeCategory,
        searchTerm,
        severityFilters,
        statusFilters,
        removeDuplicateAlerts
    ]);
    const handleDismiss = async (id)=>{
        setActionLoading(id);
        await dismissAlert(id);
        setActionLoading(null);
    };
    const handleResolve = async (id)=>{
        setActionLoading(id);
        await resolveAlert(id);
        setActionLoading(null);
    };
    const handleRefresh = async ()=>{
        await handleManualRefresh();
    };
    const handleCleanupDuplicates = async ()=>{
        if (window.confirm("Deseja remover todos os alertas duplicados? Esta ação não pode ser desfeita.")) {
            try {
                setCleanupLoading(true);
                setCleanupMessage(null);
                const response = await fetch('/api/alerts/cleanup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Erro ao limpar alertas duplicados');
                }
                const result = await response.json();
                setCleanupMessage(result.message);
                setShowCleanupMessage(true);
                // Recarregar alertas em vez de recarregar a página inteira
                await fetchAlerts();
            } catch (error) {
                setCleanupMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                setShowCleanupMessage(true);
            } finally{
                setCleanupLoading(false);
            }
        }
    };
    // Função para limpar alertas de EC2
    const handleCleanupEC2Alerts = async ()=>{
        const confirmCleanup = window.confirm("Esta ação removerá todos os alertas de EC2 da plataforma. Deseja continuar?");
        if (!confirmCleanup) return;
        setEc2CleanupLoading(true);
        setCleanupMessage(null);
        try {
            const response = await fetch("/api/alerts/ec2/cleanup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) {
                const result = await response.json();
                setCleanupMessage(result.message);
                setShowCleanupMessage(true);
                handleRefresh();
            } else {
                const errorData = await response.json();
                setCleanupMessage(`Erro ao limpar alertas de EC2: ${errorData.error || "Erro desconhecido"}`);
                setShowCleanupMessage(true);
            }
        } catch (error) {
            console.error("Erro ao limpar alertas de EC2:", error);
            setCleanupMessage("Erro ao limpar alertas de EC2: " + (error.message || "Erro desconhecido"));
            setShowCleanupMessage(true);
        } finally{
            setEc2CleanupLoading(false);
        }
    };
    // Função para formatar o tipo de recurso para exibição
    const formatResourceType = (resourceType)=>{
        // Identificar o prefixo do serviço
        let prefix = '';
        let name = resourceType;
        if (resourceType.startsWith('IAM')) {
            prefix = 'IAM';
            name = resourceType.substring(3);
        } else if (resourceType.startsWith('EC2')) {
            prefix = 'EC2';
            name = resourceType.substring(3);
        } else if (resourceType.startsWith('S3')) {
            prefix = 'S3';
            name = resourceType.substring(2);
        } else if (resourceType.startsWith('RDS')) {
            prefix = 'RDS';
            name = resourceType.substring(3);
        } else if (resourceType.startsWith('DB')) {
            prefix = 'DB';
            name = resourceType.substring(2);
        } else if (resourceType.startsWith('DynamoDB')) {
            prefix = 'DynamoDB';
            name = resourceType.substring(8);
        } else if (resourceType.startsWith('Lambda')) {
            prefix = 'Lambda';
            name = resourceType.substring(6);
        }
        // Se o nome começar com letra maiúscula e não tiver espaço, 
        // adiciona um espaço antes de cada letra maiúscula (exceto a primeira)
        if (name.length > 0 && /^[A-Z]/.test(name) && !name.includes(' ')) {
            name = name.replace(/([A-Z])/g, ' $1').trim();
        }
        return prefix ? `${prefix}-${name}` : resourceType;
    };
    // Função para formatar o tipo de recurso para texto legível
    const getResourceTypeText = (resourceType)=>{
        switch(resourceType){
            case 'AccessKey':
                return 'Chave de Acesso';
            case 'IAMPolicy':
                return 'Política IAM';
            case 'IAMRole':
                return 'Função IAM';
            case 'IAMUser':
                return 'Usuário IAM';
            case 'SecretManager':
                return 'Secret Manager';
            case 'EC2Instance':
                return 'Instância EC2';
            case 'SecurityGroup':
                return 'Grupo de Segurança';
            case 'VPC':
                return 'VPC';
            case 'NetworkACL':
                return 'ACL de Rede';
            case 'ELB':
                return 'Load Balancer';
            case 'ENI':
                return 'Interface de Rede';
            case 'S3Bucket':
                return 'Bucket S3';
            case 'S3Object':
                return 'Objeto S3';
            case 'RDSInstance':
                return 'Instância RDS';
            case 'DBSecurityGroup':
                return 'Grupo de Segurança BD';
            default:
                return formatResourceType(resourceType);
        }
    };
    const getSeverityLabel = (severity)=>{
        const labels = {
            'CRITICAL': 'Crítico',
            'HIGH': 'Alto',
            'MEDIUM': 'Médio',
            'LOW': 'Baixo',
            'INFO': 'Informativo'
        };
        return labels[severity] || severity;
    };
    const getStatusLabel = (status)=>{
        const labels = {
            'OPEN': 'Aberto',
            'IN_PROGRESS': 'Em Progresso',
            'RESOLVED': 'Resolvido',
            'DISMISSED': 'Ignorado'
        };
        return labels[status] || status;
    };
    // Funções de manipulação de UI
    const handleResetFilters = ()=>{
        setSeverityFilters({
            'CRITICAL': true,
            'HIGH': true,
            'MEDIUM': true,
            'LOW': true,
            'INFO': true
        });
        setStatusFilters({
            'OPEN': true,
            'IN_PROGRESS': true,
            'RESOLVED': false,
            'DISMISSED': false
        });
        setTimeRange('week');
        setSearchTerm('');
    };
    const handleToggleFilters = ()=>{
        setShowFilters(!showFilters);
    };
    const handleCategoryChange = (category)=>{
        setActiveCategory(category);
    };
    // Funções para obter cores e cabeçalhos baseados na severidade
    function getSeverityHeaderColor(severity) {
        switch(severity){
            case 'CRITICAL':
                return 'bg-red-600';
            case 'HIGH':
                return 'bg-orange-500';
            case 'MEDIUM':
                return 'bg-yellow-500';
            case 'LOW':
                return 'bg-blue-500';
            case 'INFO':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    }
    // Funções para obter recomendações de mitigação baseadas no tipo de alerta
    function getMitigationRecommendation(alert) {
        const resourceType = alert.resourceType;
        if ([
            'AccessKey',
            'IAMPolicy',
            'IAMRole',
            'IAMUser',
            'SecretManager'
        ].includes(resourceType)) {
            return 'Este alerta está relacionado a vulnerabilidades de identidade e acesso na AWS. Recomendamos uma revisão das permissões e políticas para garantir que estejam alinhadas com o princípio de privilégio mínimo.';
        } else if ([
            'EC2Instance',
            'SecurityGroup',
            'VPC',
            'NetworkACL',
            'ELB',
            'ENI'
        ].includes(resourceType)) {
            return 'Este alerta está relacionado a configurações de rede e computação que podem expor seus recursos a riscos de segurança. Recomendamos revisar e ajustar as configurações de acordo com as melhores práticas.';
        } else if ([
            'S3Bucket',
            'S3Object'
        ].includes(resourceType)) {
            return 'Este alerta está relacionado a vulnerabilidades de armazenamento S3 que podem resultar em exposição de dados. Verifique as permissões de acesso e a configuração de criptografia para proteger seus dados.';
        } else if ([
            'RDSInstance',
            'DBSecurityGroup'
        ].includes(resourceType)) {
            return 'Este alerta está relacionado a configurações de banco de dados que podem comprometer a segurança de seus dados. Recomendamos revisar as configurações de segurança e acesso ao banco de dados.';
        } else {
            return 'Este alerta indica uma possível vulnerabilidade de segurança em seu ambiente AWS. Recomendamos revisar a configuração do recurso afetado e aplicar as melhores práticas de segurança.';
        }
    }
    // Função para obter passos de mitigação específicos baseados no alerta
    function getMitigationSteps(alert) {
        const resourceType = alert.resourceType;
        if ([
            'AccessKey',
            'IAMUser'
        ].includes(resourceType)) {
            return [
                'Revise as políticas de IAM anexadas ao usuário ou à chave de acesso',
                'Verifique se o princípio de privilégio mínimo está sendo aplicado',
                'Considere implementar a rotação automática de credenciais',
                'Ative a autenticação multifator (MFA) para usuários com acesso ao console',
                'Monitore regularmente atividades suspeitas usando o AWS CloudTrail'
            ];
        } else if ([
            'IAMPolicy',
            'IAMRole'
        ].includes(resourceType)) {
            return [
                'Revise as políticas para remover permissões excessivas ou desnecessárias',
                'Implemente condições nas políticas para restringir o acesso por IP, hora ou outros fatores',
                'Considere usar políticas gerenciadas pela AWS quando apropriado',
                'Implemente análise regular de permissões não utilizadas',
                'Configure o AWS Access Analyzer para identificar recursos compartilhados externamente'
            ];
        } else if ([
            'EC2Instance',
            'SecurityGroup'
        ].includes(resourceType)) {
            return [
                'Revise as regras de grupos de segurança para garantir que apenas as portas necessárias estejam abertas',
                'Implemente o princípio de menor privilégio para as regras de entrada e saída',
                'Configure o registro e monitoramento de atividades suspeitas',
                'Mantenha as imagens do sistema operacional atualizadas',
                'Considere implementar um host bastion para acessar instâncias privadas'
            ];
        } else if ([
            'S3Bucket',
            'S3Object'
        ].includes(resourceType)) {
            return [
                'Desative o acesso público aos buckets S3 quando não necessário',
                'Implemente políticas de bucket restritivas',
                'Ative a criptografia em repouso para todos os objetos',
                'Configure o registro de acesso ao bucket',
                'Implemente o versionamento para proteger contra exclusão acidental'
            ];
        } else if ([
            'RDSInstance',
            'DBSecurityGroup'
        ].includes(resourceType)) {
            return [
                'Garanta que as instâncias de banco de dados não sejam publicamente acessíveis',
                'Implemente grupos de segurança restritivos para controlar o acesso',
                'Ative a criptografia para dados em repouso e em trânsito',
                'Configure backups automatizados e retenção adequada',
                'Implemente a autenticação IAM para MySQL e PostgreSQL quando possível'
            ];
        } else {
            return [
                'Revise a configuração do recurso de acordo com as melhores práticas de segurança da AWS',
                'Implemente o princípio de menor privilégio para controle de acesso',
                'Configure o monitoramento e alertas para atividades suspeitas',
                'Documente e atualize regularmente seus procedimentos de segurança',
                'Realize revisões periódicas de segurança de sua infraestrutura'
            ];
        }
    }
    // Função para obter link de documentação baseado no tipo de alerta
    function getDocumentationLink(alert) {
        const resourceType = alert.resourceType;
        if ([
            'AccessKey',
            'IAMPolicy',
            'IAMRole',
            'IAMUser',
            'SecretManager'
        ].includes(resourceType)) {
            return 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html';
        } else if ([
            'EC2Instance',
            'SecurityGroup',
            'VPC',
            'NetworkACL',
            'ELB',
            'ENI'
        ].includes(resourceType)) {
            return 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security.html';
        } else if ([
            'S3Bucket',
            'S3Object'
        ].includes(resourceType)) {
            return 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html';
        } else if ([
            'RDSInstance',
            'DBSecurityGroup'
        ].includes(resourceType)) {
            return 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.Security.html';
        } else {
            return 'https://aws.amazon.com/security/security-resources/';
        }
    }
    // Função para formatar a data para exibição
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateString;
        }
    }
    // Função para obter dados de alertas por data para o gráfico de tendência
    function getAlertsByDate(alerts) {
        const dateMap = new Map();
        // Agrupar alertas por data (dia)
        alerts.forEach((alert)=>{
            const date = new Date(alert.createdAt);
            const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0];
            if (dateMap.has(dateKey)) {
                dateMap.set(dateKey, dateMap.get(dateKey) + 1);
            } else {
                dateMap.set(dateKey, 1);
            }
        });
        // Ordenar por data
        const sortedEntries = Array.from(dateMap.entries()).sort((a, b)=>{
            return new Date(a[0]).getTime() - new Date(b[0]).getTime();
        });
        // Limitar para os últimos 30 dias se houver muitos dados
        const limitedEntries = sortedEntries.length > 30 ? sortedEntries.slice(sortedEntries.length - 30) : sortedEntries;
        // Formatar para o gráfico
        return limitedEntries.map(([date, count])=>{
            return {
                date: new Date(date).toLocaleDateString('pt-BR'),
                count
            };
        });
    }
    // Função para limpar TODOS os alertas (nova funcionalidade)
    const handleCleanupAllAlerts = async ()=>{
        if (window.confirm("Esta ação removerá TODOS os alertas do sistema. Esta operação não pode ser desfeita. Deseja continuar?")) {
            try {
                setCleanupLoading(true);
                setCleanupMessage(null);
                const response = await fetch('/api/alerts/cleanup/all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Erro ao limpar todos os alertas');
                }
                const result = await response.json();
                setCleanupMessage(result.message);
                setShowCleanupMessage(true);
                // Recarregar alertas em vez de recarregar a página inteira
                await fetchAlerts();
            } catch (error) {
                setCleanupMessage(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
                setShowCleanupMessage(true);
            } finally{
                setCleanupLoading(false);
            }
        }
    };
    // Efeito para garantir que o modal permaneça aberto quando os alertas mudam
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SecurityPage.useEffect": ()=>{
            if (showModal && alertDetailsModal) {
                // Se o alerta selecionado não estiver mais presente nos alertas, podemos buscar novamente
                const alertStillExists = alerts.some({
                    "SecurityPage.useEffect.alertStillExists": (a)=>a.id === alertDetailsModal.id
                }["SecurityPage.useEffect.alertStillExists"]);
                if (!alertStillExists) {
                    // Opção 1: Manter o modal aberto mesmo assim
                    console.log("Alerta no modal não encontrado mais na lista, mas mantendo aberto");
                // Opção 2 (alternativa): Fechar o modal se o alerta não existir mais
                // console.log("Alerta no modal não encontrado mais na lista, fechando modal");
                // handleCloseModal();
                }
            }
        }
    }["SecurityPage.useEffect"], [
        alerts,
        showModal,
        alertDetailsModal
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container px-2 py-4 mx-auto max-w-full h-screen flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showCleanupMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: -50
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -50
                    },
                    className: "fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center",
                    style: {
                        maxWidth: '90vw'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "h-5 w-5 mr-2 text-indigo-400"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1402,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: cleanupMessage
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1403,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowCleanupMessage(false),
                            className: "ml-3 text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1408,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1404,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1395,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/security/page.tsx",
                lineNumber: 1393,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: showIamScanMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: -50
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -50
                    },
                    className: "fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-900 text-yellow-200 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center",
                    style: {
                        maxWidth: '90vw'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "h-5 w-5 mr-2 text-yellow-400"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1424,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: iamScanMessage
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1425,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowIamScanMessage(false),
                            className: "ml-3 text-yellow-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-5 w-5"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1430,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1426,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1417,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/security/page.tsx",
                lineNumber: 1415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400",
                                        children: "Análise de Segurança AWS"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1440,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-600 dark:text-gray-400",
                                        children: "Monitore vulnerabilidades e configurações de segurança em sua infraestrutura"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1443,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1439,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                                whileHover: {
                                                    scale: 1.05
                                                },
                                                whileTap: {
                                                    scale: 0.95
                                                },
                                                onClick: toggleAutoRefresh,
                                                className: `px-3 py-2 rounded-lg shadow-sm flex items-center font-medium text-sm transition-colors duration-200 ${autoRefresh ? 'bg-green-700/80 dark:bg-green-900/50 text-green-50 dark:text-green-300 hover:bg-green-600 dark:hover:bg-green-900/70' : 'bg-gray-200 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700/70'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: `h-4 w-4 mr-2 ${autoRefresh ? 'animate-pulse' : ''}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1462,
                                                        columnNumber: 17
                                                    }, this),
                                                    autoRefresh ? `Auto (${refreshInterval}s)` : 'Auto Off',
                                                    autoRefresh && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 relative flex h-2 w-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1466,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "relative inline-flex rounded-full h-2 w-2 bg-green-500"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1467,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1465,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1470,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1452,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                onClick: toggleRefreshMenu,
                                                className: "absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-black/20 transition-colors cursor-pointer",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                    className: "h-3 w-3 text-current opacity-70"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1477,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1473,
                                                columnNumber: 15
                                            }, this),
                                            showRefreshMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute right-0 top-10 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 border border-gray-200 dark:border-gray-700",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300",
                                                            children: "Intervalo de Atualização"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1483,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                15,
                                                                30,
                                                                60,
                                                                120,
                                                                300
                                                            ].map((seconds)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    className: `w-full text-left px-3 py-1.5 text-sm rounded-md ${refreshInterval === seconds ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`,
                                                                    onClick: ()=>setRefreshRate(seconds),
                                                                    children: seconds < 60 ? `${seconds} segundos` : `${seconds / 60} ${seconds === 60 ? 'minuto' : 'minutos'}`
                                                                }, seconds, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1486,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1484,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1482,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1481,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1451,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                        whileHover: {
                                            scale: 1.05
                                        },
                                        whileTap: {
                                            scale: 0.95
                                        },
                                        onClick: (e)=>runUnifiedBackgroundScan(true),
                                        className: "bg-indigo-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200 flex items-center font-medium text-sm",
                                        disabled: scanning,
                                        children: scanning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "animate-spin h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1514,
                                                    columnNumber: 19
                                                }, this),
                                                "Escaneando..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1519,
                                                    columnNumber: 19
                                                }, this),
                                                "Escanear Vulnerabilidades"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1505,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                        whileHover: {
                                            scale: 1.05
                                        },
                                        whileTap: {
                                            scale: 0.95
                                        },
                                        onClick: handleCleanupDuplicates,
                                        className: "bg-amber-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-amber-700 transition-colors duration-200 flex items-center font-medium text-sm",
                                        disabled: cleanupLoading,
                                        children: cleanupLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "animate-spin h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1535,
                                                    columnNumber: 19
                                                }, this),
                                                "Limpando..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1540,
                                                    columnNumber: 19
                                                }, this),
                                                "Limpar Duplicados"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1526,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                        whileHover: {
                                            scale: 1.05
                                        },
                                        whileTap: {
                                            scale: 0.95
                                        },
                                        onClick: handleCleanupAllAlerts,
                                        className: "bg-pink-600 text-white px-3 py-2 rounded-lg shadow-sm hover:bg-pink-700 transition-colors duration-200 flex items-center font-medium text-sm",
                                        disabled: cleanupLoading,
                                        children: cleanupLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "animate-spin h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1556,
                                                    columnNumber: 19
                                                }, this),
                                                "Limpando..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1561,
                                                    columnNumber: 19
                                                }, this),
                                                "Limpar Alertas"
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1547,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1449,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                        lineNumber: 1438,
                        columnNumber: 9
                    }, this),
                    !selectedCredential?.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        className: "bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-30 rounded-lg p-3 mt-3 mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    className: "h-5 w-5 mr-3 text-amber-500 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1577,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-medium mb-1",
                                            children: "Nenhuma credencial AWS selecionada"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1579,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs",
                                            children: "Para visualizar os alertas de segurança, selecione uma credencial AWS válida no menu superior."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1580,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard/credentials",
                                                className: "inline-flex items-center px-3 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-md text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-700 transition-colors",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Key$3e$__["Key"], {
                                                        className: "h-3 w-3 mr-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1585,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Gerenciar Credenciais"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1584,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1583,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1578,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1576,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                        lineNumber: 1571,
                        columnNumber: 11
                    }, this) : null,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleToggleFilters,
                                className: "flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                        className: "h-4 w-4 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1600,
                                        columnNumber: 13
                                    }, this),
                                    "Filtros",
                                    showFilters ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4 ml-1 transform rotate-180"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1603,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "h-4 w-4 ml-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1605,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1596,
                                columnNumber: 11
                            }, this),
                            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    height: 0
                                },
                                animate: {
                                    opacity: 1,
                                    height: 'auto'
                                },
                                exit: {
                                    opacity: 0,
                                    height: 0
                                },
                                className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 mb-3",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                    children: "Severidade"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1619,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        'CRITICAL',
                                                        'HIGH',
                                                        'MEDIUM',
                                                        'LOW'
                                                    ].map((sev)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: `filter-severity-${sev}`,
                                                                    type: "checkbox",
                                                                    checked: severityFilter.includes(sev),
                                                                    onChange: ()=>toggleSeverityFilter(sev),
                                                                    className: "h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1625,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    htmlFor: `filter-severity-${sev}`,
                                                                    className: "ml-2 text-xs text-gray-700 dark:text-gray-300",
                                                                    children: getSeverityLabel(sev)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1632,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, sev, true, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1624,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1622,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1618,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
                                                    children: "Período"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1642,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "filter-date-week",
                                                                    type: "radio",
                                                                    checked: timeRange === 'week',
                                                                    onChange: ()=>setTimeRange('week'),
                                                                    className: "h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1647,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "filter-date-week",
                                                                    className: "ml-2 text-xs text-gray-700 dark:text-gray-300",
                                                                    children: "Últimos 7 dias"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1654,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1646,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    id: "filter-date-month",
                                                                    type: "radio",
                                                                    checked: timeRange === 'month',
                                                                    onChange: ()=>setTimeRange('month'),
                                                                    className: "h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1659,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    htmlFor: "filter-date-month",
                                                                    className: "ml-2 text-xs text-gray-700 dark:text-gray-300",
                                                                    children: "Últimos 30 dias"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1666,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1658,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1645,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1641,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                className: "h-4 w-4 text-gray-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1677,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1676,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            className: "block w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm",
                                                            placeholder: "Pesquisar alertas...",
                                                            value: searchTerm,
                                                            onChange: (e)=>setSearchTerm(e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1679,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1675,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-1 flex justify-end",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleResetFilters,
                                                        className: "text-xs text-indigo-500 hover:text-indigo-700",
                                                        children: "Limpar Filtros"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1688,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1687,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1674,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1616,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1610,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                        lineNumber: 1595,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/dashboard/security/page.tsx",
                lineNumber: 1437,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-grow flex flex-col min-h-0",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center items-center flex-grow",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1707,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 dark:text-gray-400",
                                children: "Carregando alertas de segurança..."
                            }, void 0, false, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1708,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                        lineNumber: 1706,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1705,
                    columnNumber: 11
                }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-bold",
                            children: "Erro ao carregar alertas"
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1713,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1714,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1712,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col flex-grow min-h-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-5 gap-2 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-600 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-200 dark:bg-gray-600 p-1.5 rounded-lg mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__["AlertOctagon"], {
                                                className: "h-4 w-4 text-gray-500 dark:text-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1722,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1721,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 dark:text-gray-400",
                                                    children: "Total"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1725,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-gray-900 dark:text-white",
                                                    children: alerts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1726,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1724,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1720,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800/50 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-red-200 dark:bg-red-800/50 p-1.5 rounded-lg mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                className: "h-4 w-4 text-red-600 dark:text-red-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1731,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1730,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-red-600 dark:text-red-400",
                                                    children: "Críticos"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1734,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-red-700 dark:text-red-300",
                                                    children: alerts.filter((a)=>a.severity === 'CRITICAL').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1735,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1733,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1729,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-100 dark:border-orange-800/50 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-orange-200 dark:bg-orange-800/50 p-1.5 rounded-lg mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "h-4 w-4 text-orange-600 dark:text-orange-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1740,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1739,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-orange-600 dark:text-orange-400",
                                                    children: "Altos"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1743,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-orange-700 dark:text-orange-300",
                                                    children: alerts.filter((a)=>a.severity === 'HIGH').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1744,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1742,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1738,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg border border-yellow-100 dark:border-yellow-800/50 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-yellow-200 dark:bg-yellow-800/50 p-1.5 rounded-lg mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$octagon$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertOctagon$3e$__["AlertOctagon"], {
                                                className: "h-4 w-4 text-yellow-600 dark:text-yellow-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1749,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1748,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-yellow-600 dark:text-yellow-400",
                                                    children: "Médios"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1752,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-yellow-700 dark:text-yellow-300",
                                                    children: alerts.filter((a)=>a.severity === 'MEDIUM').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1753,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1751,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1747,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50 flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-200 dark:bg-blue-800/50 p-1.5 rounded-lg mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                className: "h-4 w-4 text-blue-600 dark:text-blue-400"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1758,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1757,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-blue-600 dark:text-blue-400",
                                                    children: "Baixos"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1761,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-lg font-bold text-blue-700 dark:text-blue-300",
                                                    children: alerts.filter((a)=>a.severity === 'LOW').length
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1762,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1760,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1756,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1719,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 flex-grow flex flex-col min-h-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold text-gray-900 dark:text-white",
                                                children: "Alertas de Segurança"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1771,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 dark:text-gray-400 mt-0.5",
                                                children: [
                                                    filteredAlerts.length,
                                                    filteredAlerts.length === 1 ? ' alerta encontrado' : ' alertas encontrados',
                                                    autoRefresh && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 text-indigo-500 dark:text-indigo-400",
                                                        children: "• Atualização automática ativa"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1776,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1772,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1770,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1769,
                                    columnNumber: 15
                                }, this),
                                filteredAlerts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center flex-grow flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                        initial: {
                                            opacity: 0,
                                            scale: 0.8
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1
                                        },
                                        transition: {
                                            duration: 0.3
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                className: "h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1791,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-medium text-gray-900 dark:text-gray-100 mb-2",
                                                children: "Nenhum alerta encontrado"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1792,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 dark:text-gray-400 max-w-md mx-auto",
                                                children: !selectedCredential?.id ? "Selecione uma credencial AWS válida para visualizar os alertas de segurança." : "Não foram encontrados alertas com os filtros atuais. Tente ajustar os filtros ou realizar uma nova verificação de segurança."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1793,
                                                columnNumber: 21
                                            }, this),
                                            selectedCredential?.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleRefresh,
                                                className: "mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                        className: "h-4 w-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1803,
                                                        columnNumber: 25
                                                    }, this),
                                                    "Atualizar Alertas"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1799,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1786,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1785,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-auto flex-grow",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Severidade"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1814,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Título"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1817,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Recurso"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1820,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Detectado em"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1823,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1826,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            scope: "col",
                                                            className: "px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                                                            children: "Ações"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 1829,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 1813,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1812,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700",
                                                children: filteredAlerts.map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].tr, {
                                                        initial: highlightedAlerts.includes(alert.id) ? {
                                                            backgroundColor: '#4f46e533'
                                                        } : {},
                                                        animate: {
                                                            backgroundColor: 'transparent'
                                                        },
                                                        transition: {
                                                            duration: 2.5
                                                        },
                                                        onClick: ()=>handleOpenModal(alert),
                                                        className: "hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 whitespace-nowrap",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${alert.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : alert.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' : alert.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : alert.severity === 'LOW' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`,
                                                                    children: getSeverityLabel(alert.severity)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1845,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1844,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-gray-900 dark:text-gray-100 font-medium truncate max-w-xs",
                                                                        children: alert.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                        lineNumber: 1856,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs",
                                                                        children: alert.description.length > 80 ? `${alert.description.slice(0, 80)}...` : alert.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                        lineNumber: 1859,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1855,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 whitespace-nowrap",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-sm text-gray-900 dark:text-gray-100",
                                                                        children: formatResourceType(alert.resourceType)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                        lineNumber: 1866,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-xs text-gray-500 dark:text-gray-400",
                                                                        children: alert.resourceId?.length > 15 ? `${alert.resourceId.slice(0, 15)}...` : alert.resourceId
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                        lineNumber: 1869,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1865,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400",
                                                                children: formatDate(alert.createdAt)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1875,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 whitespace-nowrap",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(alert.status)}`,
                                                                    children: getStatusLabel(alert.status)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1879,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1878,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-3 whitespace-nowrap text-right text-sm font-medium",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-end space-x-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                handleDismiss(alert.id);
                                                                            },
                                                                            className: "text-gray-400 hover:text-gray-500 dark:hover:text-gray-300",
                                                                            title: "Descartar",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                                lineNumber: 1893,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                            lineNumber: 1885,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                handleResolve(alert.id);
                                                                            },
                                                                            className: "text-green-500 hover:text-green-600 dark:hover:text-green-400",
                                                                            title: "Marcar como resolvido",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                                lineNumber: 1903,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                            lineNumber: 1895,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                    lineNumber: 1884,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                                lineNumber: 1883,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, alert.id, true, {
                                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                        lineNumber: 1836,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1834,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1811,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1810,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1768,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1717,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/security/page.tsx",
                lineNumber: 1703,
                columnNumber: 7
            }, this),
            showModal && alertDetailsModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4",
                onClick: ()=>handleCloseModal(),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 50
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: 50
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `px-4 py-4 sm:px-6 ${getSeverityHeaderColor(alertDetailsModal.severity)}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg leading-6 font-medium text-gray-900 dark:text-white",
                                        children: alertDetailsModal.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1935,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        className: "bg-transparent rounded-md text-gray-400 hover:text-gray-500 focus:outline-none",
                                        onClick: (e)=>handleCloseModal(e),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "sr-only",
                                                children: "Fechar"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1943,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "h-6 w-6",
                                                "aria-hidden": "true"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 1944,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 1938,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                lineNumber: 1934,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1933,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-5 sm:p-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 flex flex-wrap gap-2 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${alertDetailsModal.severity === 'CRITICAL' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : alertDetailsModal.severity === 'HIGH' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' : alertDetailsModal.severity === 'MEDIUM' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : alertDetailsModal.severity === 'LOW' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`,
                                            children: getSeverityLabel(alertDetailsModal.severity)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1953,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeColor(alertDetailsModal.status)}`,
                                            children: getStatusLabel(alertDetailsModal.status)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1965,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1952,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "Tipo de recurso"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1974,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-900 dark:text-white mt-1",
                                            children: formatResourceType(alertDetailsModal.resourceType)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1975,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1973,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "ID do recurso"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1980,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-900 dark:text-white mt-1 overflow-ellipsis overflow-hidden",
                                            children: alertDetailsModal.resourceId
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1981,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1979,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "Detectado em"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1986,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium text-gray-900 dark:text-white mt-1",
                                            children: formatDate(alertDetailsModal.createdAt)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1987,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1985,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "Descrição"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1992,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-900 dark:text-white mt-1",
                                            children: alertDetailsModal.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1993,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1991,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "Recomendação"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1998,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-900 dark:text-white mt-1",
                                            children: getMitigationRecommendation(alertDetailsModal)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 1999,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 1997,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 dark:text-gray-400",
                                            children: "Passos para mitigação"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 2004,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "mt-1 space-y-2",
                                            children: getMitigationSteps(alertDetailsModal).map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "text-sm text-gray-900 dark:text-white flex items-start",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "mr-2 text-sm text-indigo-600 dark:text-indigo-400",
                                                            children: "•"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                            lineNumber: 2008,
                                                            columnNumber: 23
                                                        }, this),
                                                        " ",
                                                        step
                                                    ]
                                                }, index, true, {
                                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                    lineNumber: 2007,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 2005,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 2003,
                                    columnNumber: 15
                                }, this),
                                getDocumentationLink(alertDetailsModal) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-span-2 mt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: getDocumentationLink(alertDetailsModal),
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                className: "h-4 w-4 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/dashboard/security/page.tsx",
                                                lineNumber: 2023,
                                                columnNumber: 21
                                            }, this),
                                            "Ver documentação de referência"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/dashboard/security/page.tsx",
                                        lineNumber: 2017,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 2016,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 1950,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-4 py-4 sm:px-6 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition",
                                    onClick: (e)=>{
                                        e.stopPropagation(); // Impedir propagação
                                        handleResolve(alertDetailsModal.id);
                                        setTimeout(()=>handleCloseModal(), 300); // Atrasar fechamento para feedback visual
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-4 w-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 2041,
                                            columnNumber: 17
                                        }, this),
                                        " Marcar como resolvido"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 2032,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    className: "inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition",
                                    onClick: (e)=>{
                                        e.stopPropagation(); // Impedir propagação
                                        handleDismiss(alertDetailsModal.id);
                                        setTimeout(()=>handleCloseModal(), 300); // Atrasar fechamento para feedback visual
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$slash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Slash$3e$__["Slash"], {
                                            className: "h-4 w-4 mr-1"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                                            lineNumber: 2052,
                                            columnNumber: 17
                                        }, this),
                                        " Descartar alerta"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                                    lineNumber: 2043,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/dashboard/security/page.tsx",
                            lineNumber: 2031,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/dashboard/security/page.tsx",
                    lineNumber: 1924,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/dashboard/security/page.tsx",
                lineNumber: 1920,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/dashboard/security/page.tsx",
        lineNumber: 1391,
        columnNumber: 5
    }, this);
}
_s(SecurityPage, "YcoPHRTAeEndx4gWhYwMAYiYy3I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAwsCredentials$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwsCredentials"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAlerts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = SecurityPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "LineGraph");
__turbopack_context__.k.register(_c1, "SecurityPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_c8f2a6a6._.js.map