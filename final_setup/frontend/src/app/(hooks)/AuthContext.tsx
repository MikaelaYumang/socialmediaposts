// // "use client";

// // import React, { createContext, useContext, useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // interface User {
// //   id: string;
// //   username: string;
// //   email: string;
// //   // add other user fields here
// // }

// // interface AuthContextType {
// //   user: User | null;
// //   loading: boolean;
// // }

// // const AuthContext = createContext<AuthContextType>({
// //   user: null,
// //   loading: true,
// // });

// // export function AuthProvider({ children }: { children: React.ReactNode }) {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   useEffect(() => {
// //     fetch("http://localhost:5000/check/", {
// //       credentials: "include",
// //     })
// //       .then((res) => res.json())
// //       .then((data) => {
// //         if (data.authenticated) {
// //           setUser(data.user);
// //         } else {
// //           router.push("/auth/login");
// //         }
// //       })
// //       .finally(() => setLoading(false));
// //   }, [router]);

// //   return (
// //     <AuthContext.Provider value={{ user, loading }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   return useContext(AuthContext);
// // }



// "use client";

// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   // add other user fields here
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   fetchUser: () => Promise<void>;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   fetchUser: async () => {},
//   setUser: () => {},
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // fetchUser defined with useCallback so it won't change on every render
//   const fetchUser = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:5000/check/", {
//         credentials: "include",
//       });
//       const data = await res.json();
//       if (data.authenticated) {
//         setUser(data.user);
//       } else {
//         setUser(null);
//         router.push("/auth/login");
//       }
//     } catch (error) {
//       setUser(null);
//       router.push("/auth/login");
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   return (
//     <AuthContext.Provider value={{ user, loading, fetchUser, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
