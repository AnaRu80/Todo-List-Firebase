import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../firebase'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tareas:[],
    tarea:{nombre:'', id:''}
  },
  mutations: {
    setTareas(state, payload){
      state.tareas=payload;
    },
    setTarea(state,payload){
      state.tarea=payload
    },
    setEliminarTareas(state,payload){
      state.tareas=state.tareas.filter(item=> item.id !==payload)
    }
  },
  actions: {
    // Tener todas las tareas
    getTareas({commit}){
      const tareas=[]
      //  este es el mismo  nombre que la colección
      db.collection('tareas').get()
        .then(res =>{
          res.forEach(doc =>{
            console.log(doc.id )
            console.log(doc.data() )
            let tarea=doc.data()
            tarea.id=doc.id
            tareas.push(tarea)
          })
          commit ('setTareas',tareas)
        })
    },
    // Obtener una sola tarea
    getTarea({commit},idTarea){
       db.collection('tareas').doc(idTarea).get()
        .then(doc => {
          console.log(doc.id)
          console.log(doc.data())
          let tarea= doc.data()
          tarea.id=doc.id
          commit('setTarea', tarea)
        })
    },
    //Editar la Tarea
    editarTarea({commit},tarea){
      db.collection('tareas').doc(tarea.id).update({
      nombre:tarea.nombre  
      })
      .then(()=>{
        console.log("tarea editada")
        router.push('/')
      })
    },
    // Añade una nueva Tarea
    agregarTarea({commit},nombreTarea){
      db.collection('tareas').add({
        nombre: nombreTarea
      })
      .then(doc => {
        console.log(doc.id)
        router.push('/')
      })
    },
    //Eliminar una Tarea
    eliminarTarea({commit,dispatch},idTarea){
      db.collection('tareas').doc(idTarea).delete()
      .then(() => {
        console.log("tarea Eliminada")
        // No es tan recomendable porque estas haciendo peticiones al servidor 
        // dispatch('getTareas')
        commit('setEliminarTareas', idTarea)
      })
    }

  },
  modules: {
  }
})
