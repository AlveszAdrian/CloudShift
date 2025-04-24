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
                throw new Error(`Failed to fetch credentials: ${response.status}`);
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
            setError(`Error fetching credentials: ${err instanceof Error ? err.message : String(err)}`);
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
            const response = await fetch('/api/aws/credentials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credential)
            });
            if (!response.ok) {
                throw new Error(`Failed to add credential: ${response.status}`);
            }
            await fetchCredentials();
        } catch (err) {
            setError(`Error adding credential: ${err instanceof Error ? err.message : String(err)}`);
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
                throw new Error(`Failed to update credential: ${response.status}`);
            }
            await fetchCredentials();
        } catch (err) {
            setError(`Error updating credential: ${err instanceof Error ? err.message : String(err)}`);
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
                throw new Error(`Failed to delete credential: ${response.status}`);
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
            setError(`Error deleting credential: ${err instanceof Error ? err.message : String(err)}`);
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
"[project]/src/components/dashboard/AlertsCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AlertsCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useAlerts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function AlertsCard() {
    _s();
    const { alerts, loading, error, fetchAlerts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAlerts"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AlertsCard.useEffect": ()=>{
            fetchAlerts();
        }
    }["AlertsCard.useEffect"], [
        fetchAlerts
    ]);
    // Filtrar apenas alertas ativos
    const activeAlerts = alerts.filter((alert)=>alert.status === 'active');
    // Agrupar alertas por severidade
    const criticalAlerts = activeAlerts.filter((alert)=>alert.severity === 'CRITICAL');
    const highAlerts = activeAlerts.filter((alert)=>alert.severity === 'HIGH');
    const mediumAlerts = activeAlerts.filter((alert)=>alert.severity === 'MEDIUM');
    const lowAlerts = activeAlerts.filter((alert)=>alert.severity === 'LOW');
    const getColorBySeverity = (severity)=>{
        switch(severity){
            case 'CRITICAL':
                return 'bg-red-500';
            case 'HIGH':
                return 'bg-orange-500';
            case 'MEDIUM':
                return 'bg-yellow-500';
            case 'LOW':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "bg-white rounded-lg shadow-md p-6",
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.3
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-gray-800",
                        children: "Alertas de Segurança"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard/security",
                        className: "text-sm text-indigo-600 hover:text-indigo-800",
                        children: "Ver todos"
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center py-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                    lineNumber: 58,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, this) : error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-8 text-center text-red-500",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                lineNumber: 61,
                columnNumber: 9
            }, this) : activeAlerts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-8 text-center text-gray-500",
                children: "Nenhum alerta de segurança ativo."
            }, void 0, false, {
                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-4 gap-4 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-red-100 p-3 rounded-lg text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-red-700",
                                        children: criticalAlerts.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-red-600",
                                        children: "Críticos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-orange-100 p-3 rounded-lg text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-orange-700",
                                        children: highAlerts.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 74,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-orange-600",
                                        children: "Altos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 75,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-yellow-100 p-3 rounded-lg text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-yellow-700",
                                        children: mediumAlerts.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 78,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-yellow-600",
                                        children: "Médios"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-blue-100 p-3 rounded-lg text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-blue-700",
                                        children: lowAlerts.length
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-blue-600",
                                        children: "Baixos"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 83,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: activeAlerts.slice(0, 5).map((alert)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-3 h-3 rounded-full ${getColorBySeverity(alert.severity)} mr-3`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 93,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-sm font-medium text-gray-800",
                                                children: alert.title
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                                lineNumber: 95,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 truncate",
                                                children: [
                                                    alert.resourceType,
                                                    ": ",
                                                    alert.resourceId
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                                lineNumber: 96,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 94,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500",
                                        children: new Date(alert.createdAt).toLocaleDateString()
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                        lineNumber: 100,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, alert.id, true, {
                                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                                lineNumber: 89,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
                lineNumber: 67,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/dashboard/AlertsCard.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_s(AlertsCard, "5hnoW+m8TqKvAKLACUOLmgdlq+s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useAlerts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAlerts"]
    ];
});
_c = AlertsCard;
var _c;
__turbopack_context__.k.register(_c, "AlertsCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_e5c7743a._.js.map