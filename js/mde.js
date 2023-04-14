export default {
    name: "MDE",
    template: `
      <div>
            <textarea ref="mde"/>
      </div>
    `,
    props: {
      
    },
    emits: ["data"],
    watch: {
      value(newVal, oldVal) {
        this.tagify.loadOriginalValues(newVal)
      }
    },
    methods: {
      
    },
    mounted() {
      this.mde = new SimpleMDE({ element: this.$refs.mde });
      simplemde.codemirror.on("change", function(){
        this.$emit("data", simplemde.value())
    });
    }
  };