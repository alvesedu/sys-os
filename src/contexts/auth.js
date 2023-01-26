import React, { useState, useEffect, createContext } from 'react';
import firebase from '../service/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    function loadStorage() {
      //armazenando user in localstorage
      const storageUser = localStorage.getItem('SistemaUser');

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadStorage();


  }, []);


  //Logando o user
  async function signIn(email, password) {
    setLoadingAuth(true);

    await firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const userProfile = await firebase.firestore().collection('users')
          .doc(uid)
          .get();

        let data = {
          uid: uid,
          nome: userProfile.data().nome,
          avatarUrl: userProfile.data().avatarUrl,
          email: value.user.email
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success(`Bem vindo, ${data.nome}`)

      })
      .catch((error) => {
        console.log(error);
        toast.error('Erro ao logar, verifique sua senha e email!');
        setLoadingAuth(false);
      });

  }


  //cadastrar user
  async function signUp(email, password, nome) {
    setLoadingAuth(true);

    await firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        //criando a coleção
        await firebase.firestore().collection('users')
          .doc(uid)
          .set({
            nome: nome,
            avatarUrl: null,
          })
          .then(() => {

            const data = {
              uid: uid,
              nome: nome,
              email: value.user.email,
              avatarUrl: null
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success(`Bem vindo, ${data.nome}`)

          })

      }).catch((error) => {
        console.log(error);
        toast.error('Erro: verifique sua senha e email!');
        setLoadingAuth(false);
      })
  }

  function storageUser(data) {
    localStorage.setItem('SistemaUser', JSON.stringify(data));
  }


  //Sair do sistema
  async function signOut() {
    await firebase.auth().signOut();
    localStorage.removeItem('SistemaUser');
    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signUp,
        signOut,
        signIn,
        loadingAuth,
        setUser,
        storageUser
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
