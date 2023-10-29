export default {
    template: `
<div>
    <div v-if="!hasFiles" class="p-3">
        <p class="m-0 text-center">Looks like there's nothing here yet.</p>
    </div>
    <div v-if="hasFiles">
       
            <div>
                <div class="card-group">
                    <div v-for="(size, file) in files" class="card p-0" style="max-width: 300px;">
                        <a :href="'https://ipfs.io/ipfs/' + file" target="_blank" class="d-flex flex-wrap no-decoration" >
                            <img :src="'https://ipfs.io/ipfs/' + file" onerror="this.style.display='none'"
                                class="card-img-top" :alt="file">
                                <div class="card-body">
                                    <span class="text-break small text-muted">{{file}}</span>
                                </div>
                            </a>
                       <div class="card-footer text-center">
                            <button type="button" class="btn btn-primary" 
                            @click="addAsset(file, contract.i)"><i class="fa-solid fa-magnifying-glass me-2"></i>Preview</button>
                            </div>
                    </div>
                </div>
            </div>
        
    </div>
</div>
   `,
props: {
    files: {
        type: Object,
        default: {},
    },
},
data() {
    return {

    };
},
emits: [],
methods: {
},
computed: {
    hasFiles() {
        return Object.keys(this.files).length > 0;
    }
},
mounted() {
},
};