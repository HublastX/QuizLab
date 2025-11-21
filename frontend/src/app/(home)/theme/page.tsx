// "use client";

// import { useTheme } from "@/app/hook/useTheme";
// import { useState } from "react";

// export default function ThemePageTest() {
//     const {
//         themes,
//         currentTheme,
//         loading,
//         error,
//         fetchThemes,
//         fetchThemeById,
//         createTheme,
//         clearError,
//         clearCurrentTheme,
//     } = useTheme();

//     const [newThemeTitle, setNewThemeTitle] = useState("");
//     const [newThemeDescription, setNewThemeDescription] = useState("");
//     const [themeIdToFetch, setThemeIdToFetch] = useState("");

//     // Testar: Buscar todos os temas
//     const handleFetchAllThemes = async () => {
//         await fetchThemes();
//     };

//     // Testar: Buscar tema por ID
//     const handleFetchThemeById = async () => {
//         if (!themeIdToFetch.trim()) {
//             alert("Por favor, insira um ID de tema");
//             return;
//         }
//         await fetchThemeById(themeIdToFetch);
//     };

//     // Testar: Criar novo tema
//     const handleCreateTheme = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!newThemeTitle.trim()) {
//             alert("Por favor, insira um título para o tema");
//             return;
//         }

//         try {
//             await createTheme({
//                 title: newThemeTitle,
//                 description: newThemeDescription,
//             });
//             setNewThemeTitle("");
//             setNewThemeDescription("");
//             alert("Tema criado com sucesso!");
//         } catch (err) {
//             alert("Erro ao criar tema");
//         }
//     };

//     // Limpar estados
//     const handleClearAll = () => {
//         setNewThemeTitle("");
//         setNewThemeDescription("");
//         setThemeIdToFetch("");
//         clearError();
//         clearCurrentTheme();
//     };

//     return (
//         <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
//             <h1>Teste de API - Temas</h1>

//             {/* Seção de Erros */}
//             {error && (
//                 <div
//                     style={{
//                         background: "#ffebee",
//                         color: "#c62828",
//                         padding: "10px",
//                         margin: "10px 0",
//                         border: "1px solid #c62828",
//                         borderRadius: "4px",
//                     }}
//                 >
//                     <strong>Erro:</strong> {error}
//                     <button
//                         onClick={clearError}
//                         style={{
//                             marginLeft: "10px",
//                             background: "none",
//                             border: "none",
//                             color: "#c62828",
//                             cursor: "pointer",
//                         }}
//                     >
//                         ×
//                     </button>
//                 </div>
//             )}

//             {/* Seção 1: Buscar Todos os Temas */}
//             <section
//                 style={{
//                     marginBottom: "30px",
//                     padding: "15px",
//                     border: "1px solid #ddd",
//                 }}
//             >
//                 <h2>1. Buscar Todos os Temas</h2>
//                 <button
//                     onClick={handleFetchAllThemes}
//                     disabled={loading}
//                     style={{
//                         padding: "10px 15px",
//                         margin: "5px",
//                         backgroundColor: loading ? "#ccc" : "#007acc",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "4px",
//                         cursor: loading ? "not-allowed" : "pointer",
//                     }}
//                 >
//                     {loading ? "Carregando..." : "Buscar Todos os Temas"}
//                 </button>

//                 {themes.length > 0 && (
//                     <div style={{ marginTop: "15px" }}>
//                         <h3>Resultados ({themes.length} temas):</h3>
//                         <div style={{ display: "grid", gap: "10px" }}>
//                             {themes.map((theme) => (
//                                 <div
//                                     key={theme.id}
//                                     style={{
//                                         padding: "10px",
//                                         border: "1px solid #ccc",
//                                         borderRadius: "4px",
//                                         backgroundColor: "#f9f9f9",
//                                     }}
//                                 >
//                                     <strong>ID:</strong> {theme.id}
//                                     <br />
//                                     <strong>Título:</strong> {theme.title}
//                                     <br />
//                                     <strong>Descrição:</strong>{" "}
//                                     {theme.description || "N/A"}
//                                     <br />
//                                     <strong>Criado em:</strong>{" "}
//                                     {new Date(
//                                         theme.created_at
//                                     ).toLocaleString()}
//                                     <br />
//                                     <strong>User ID:</strong> {theme.user_id}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </section>

//             {/* Seção 2: Buscar Tema por ID */}
//             <section
//                 style={{
//                     marginBottom: "30px",
//                     padding: "15px",
//                     border: "1px solid #ddd",
//                 }}
//             >
//                 <h2>2. Buscar Tema por ID</h2>
//                 <div style={{ marginBottom: "10px" }}>
//                     <input
//                         type="text"
//                         placeholder="ID do tema"
//                         value={themeIdToFetch}
//                         onChange={(e) => setThemeIdToFetch(e.target.value)}
//                         style={{
//                             padding: "8px",
//                             marginRight: "10px",
//                             border: "1px solid #ccc",
//                             borderRadius: "4px",
//                             width: "300px",
//                         }}
//                     />
//                     <button
//                         onClick={handleFetchThemeById}
//                         disabled={loading}
//                         style={{
//                             padding: "8px 15px",
//                             backgroundColor: loading ? "#ccc" : "#28a745",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: loading ? "not-allowed" : "pointer",
//                         }}
//                     >
//                         {loading ? "Buscando..." : "Buscar Tema"}
//                     </button>
//                 </div>

//                 {currentTheme && (
//                     <div
//                         style={{
//                             padding: "15px",
//                             border: "2px solid #28a745",
//                             borderRadius: "4px",
//                             backgroundColor: "#f0fff4",
//                         }}
//                     >
//                         <h3>Tema Encontrado:</h3>
//                         <div>
//                             <strong>ID:</strong> {currentTheme.id}
//                             <br />
//                             <strong>Título:</strong> {currentTheme.title}
//                             <br />
//                             <strong>Descrição:</strong>{" "}
//                             {currentTheme.description || "N/A"}
//                             <br />
//                             <strong>Criado em:</strong>{" "}
//                             {new Date(currentTheme.created_at).toLocaleString()}
//                             <br />
//                             <strong>Atualizado em:</strong>{" "}
//                             {new Date(currentTheme.updated_at).toLocaleString()}
//                             <br />
//                             <strong>User ID:</strong> {currentTheme.user_id}
//                         </div>
//                         <button
//                             onClick={clearCurrentTheme}
//                             style={{
//                                 marginTop: "10px",
//                                 padding: "5px 10px",
//                                 backgroundColor: "#dc3545",
//                                 color: "white",
//                                 border: "none",
//                                 borderRadius: "4px",
//                                 cursor: "pointer",
//                             }}
//                         >
//                             Limpar
//                         </button>
//                     </div>
//                 )}
//             </section>

//             {/* Seção 3: Criar Novo Tema */}
//             <section
//                 style={{
//                     marginBottom: "30px",
//                     padding: "15px",
//                     border: "1px solid #ddd",
//                 }}
//             >
//                 <h2>3. Criar Novo Tema</h2>
//                 <form onSubmit={handleCreateTheme}>
//                     <div style={{ marginBottom: "10px" }}>
//                         <label
//                             style={{ display: "block", marginBottom: "5px" }}
//                         >
//                             Título: *
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Título do tema"
//                             value={newThemeTitle}
//                             onChange={(e) => setNewThemeTitle(e.target.value)}
//                             required
//                             style={{
//                                 padding: "8px",
//                                 width: "100%",
//                                 maxWidth: "400px",
//                                 border: "1px solid #ccc",
//                                 borderRadius: "4px",
//                             }}
//                         />
//                     </div>

//                     <div style={{ marginBottom: "10px" }}>
//                         <label
//                             style={{ display: "block", marginBottom: "5px" }}
//                         >
//                             Descrição:
//                         </label>
//                         <textarea
//                             placeholder="Descrição do tema"
//                             value={newThemeDescription}
//                             onChange={(e) =>
//                                 setNewThemeDescription(e.target.value)
//                             }
//                             style={{
//                                 padding: "8px",
//                                 width: "100%",
//                                 maxWidth: "400px",
//                                 border: "1px solid #ccc",
//                                 borderRadius: "4px",
//                                 minHeight: "80px",
//                             }}
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         style={{
//                             padding: "10px 20px",
//                             backgroundColor: loading ? "#ccc" : "#ff6b35",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "4px",
//                             cursor: loading ? "not-allowed" : "pointer",
//                         }}
//                     >
//                         {loading ? "Criando..." : "Criar Tema"}
//                     </button>
//                 </form>
//             </section>

//             {/* Seção 4: Informações do Estado */}
//             <section
//                 style={{
//                     marginBottom: "30px",
//                     padding: "15px",
//                     border: "1px solid #ddd",
//                 }}
//             >
//                 <h2>4. Estado Atual</h2>
//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns: "1fr 1fr",
//                         gap: "15px",
//                     }}
//                 >
//                     <div>
//                         <h3>Loading:</h3>
//                         <div
//                             style={{
//                                 padding: "10px",
//                                 backgroundColor: loading
//                                     ? "#fff3cd"
//                                     : "#d1ecf1",
//                                 border: `2px solid ${
//                                     loading ? "#ffc107" : "#17a2b8"
//                                 }`,
//                                 borderRadius: "4px",
//                             }}
//                         >
//                             {loading ? "SIM" : "NÃO"}
//                         </div>
//                     </div>

//                     <div>
//                         <h3>Quantidade de Temas:</h3>
//                         <div
//                             style={{
//                                 padding: "10px",
//                                 backgroundColor: "#e2e3e5",
//                                 border: "2px solid #6c757d",
//                                 borderRadius: "4px",
//                                 textAlign: "center",
//                                 fontSize: "24px",
//                                 fontWeight: "bold",
//                             }}
//                         >
//                             {themes.length}
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Botão para limpar tudo */}
//             <div style={{ textAlign: "center" }}>
//                 <button
//                     onClick={handleClearAll}
//                     style={{
//                         padding: "10px 20px",
//                         backgroundColor: "#6c757d",
//                         color: "white",
//                         border: "none",
//                         borderRadius: "4px",
//                         cursor: "pointer",
//                     }}
//                 >
//                     Limpar Tudo
//                 </button>
//             </div>

//             {/* Instruções */}
//             <div
//                 style={{
//                     marginTop: "30px",
//                     padding: "15px",
//                     backgroundColor: "#e7f3ff",
//                     border: "1px solid #b3d9ff",
//                     borderRadius: "4px",
//                 }}
//             >
//                 <h3>Como testar:</h3>
//                 <ol>
//                     <li>
//                         Clique em "Buscar Todos os Temas" para ver a lista de
//                         temas existentes
//                     </li>
//                     <li>
//                         Copie um ID da lista e use no campo "Buscar Tema por ID"
//                     </li>
//                     <li>
//                         Crie um novo tema preenchendo o formulário "Criar Novo
//                         Tema"
//                     </li>
//                     <li>
//                         Verifique se o token de acesso está no localStorage como
//                         "accessToken"
//                     </li>
//                 </ol>
//             </div>
//         </div>
//     );
// }
