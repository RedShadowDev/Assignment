const ApiInstance = axios.create({
  baseURL: "http://localhost:3000/todos",
});

const app = new Vue({
  el: "#app",
  data: {
    titulo: "ToDoVue",
    tarea: [],
    title: "",
    description: "",
    editar: false,
    crear: true,
    id: null,
  },
  methods: {
    async createTodo() {
      if (!this.title || !this.description)
        return alert("No puedes agregar una tarea vacia");
      try {
        const { data } = await ApiInstance.post("/", {
          title: this.title,
          description: this.description,
        });
        if (data) {
          alert("La tarea ha sido agregado con exito");
          this.title = "";
          this.description = "";
          this.getTodos();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async changeStatus(value, id) {
      const { data } = await ApiInstance.patch(`/${id}`, {
        isComplete: value,
      });
      if (data) {
        this.getTodos();
        alert("El estado de la tarea ha sido cambiado con exito");
      }
    },
    async getTodos() {
      const { data } = await ApiInstance.get();
      this.tarea = data;
    },
    async editTodo(title, description, id) {
      this.editar = true;
      this.crear = false;
      (this.title = title), (this.description = description);
      this.id = id;
    },
    async updateTodo() {
      let id = this.id;
      const { data } = await ApiInstance.put(`/${id}`, {
        title: this.title,
        description: this.description,
      });
      if (data) {
        alert("La tarea ha sido actualizada");
        (this.title = ""), (this.description = ""), (this.id = null);
        this.editar = false;
        this.crear = true;
        this.getTodos();
      }
    },
    async deleteTodo(id) {
      const { data } = await ApiInstance.delete(`/${id}`);
      if (data) {
        const index = this.tarea.findIndex((element) => element.id === id);
        if (index !== -1) {
          this.tarea.splice(index, 1);
          alert("La tarea ha sido eliminada con exito");
        }
      }
    },
  },
  async created() {
    this.getTodos();
  },
});
