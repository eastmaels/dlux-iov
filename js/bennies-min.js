export default{template:'<div>\n<p>Current Beneficiaries: ({{bennies?.length}}/8) {{total/100}}%</p><button v-if="!dlux" class="btn btn-sm btn-warning" @click="addBenny(\'dlux-io\', 1000)">Include in DLUX Ecosystem</button>\n<div class="table-responsive">\n<table class="table align-middle">\n<thead>\n<tr>\n<th class="w-50">Username</th>\n<th class="text-center">Reward</th>\n<th></th>\n</tr>\n</thead>\n<tbody class="table-group-divider">\n<tr v-for="ben in bennies">\n<td class="ps-0 w-50">@{{ben.account}}</td>\n<td class="text-center">\n<span class="pe-05"><button type="button" class="btn btn-sm btn-secondary" @click="decBen(ben)">-</button></span>\n<span>{{ben.weight/100}}%</span>\n<span class="ps-05"><button type="button" class="btn btn-sm btn-secondary" @click="incBen(ben)">+</button></span>\n</td>\n<td class="pe-0 text-end"><button class="btn btn-danger" @click="subBenny(ben.account)"><i class="fa-solid fa-trash-can fa-fw"></i></button></td>\n</tr>\n<tr v-if="bennies.length < 8 && total < 10000" style="border-bottom-style: hidden !important;">\n<td class="ps-0 w-50">\n<div class="position-relative">\n<span class="position-absolute start-0 top-50 translate-middle-y ps-2">\n<i class="fa-solid fa-at fa-fw"></i>\n</span>\n<input type="text" placeholder="username" class="ps-4 pe-5 text-info form-control" v-model="addAccount">\n<button class="position-absolute end-0 top-50 translate-middle-y btn btn-outline-secondary border-0 dropdown-toggle square rounded-end" :disabled="!favorites.length" type="button" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-star me-1 fa-fw"></i></button>\n<ul class="dropdown-menu bg-black dropdown-menu-dark">\n<li v-for="acc in favorites" class="d-flex align-items-center justify-content-between">\n<a class="dropdown-item rounded-end" role="button" @click="addAccount = acc">@{{acc}}</a>\n<a @click="removeFavorite(acc)" class="mx-1 btn btn-sm btn-secondary" role="button">\n<i class="fa-solid fa-xmark fa-fw"></i>\n</a>\n</li>\n</ul>\n</div>\n</td>\n<td class="text-center">\n<div class="position-relative">\n<input type="number" step="0.01" min="0.01" :max="100 - (total/100)" placeholder="amount" class="pe-4 form-control text-center" v-model="addWeight">\n<span class="position-absolute end-0 top-50 translate-middle-y pe-2">\n<i class="fa-solid fa-percent fa-fw"></i>\n</span>\n</div>\n</td>\n<td class="pe-0 text-end"><button class="btn btn-success" :disabled="!addAccount || (total + addWeight * 100) > 10000" @click="appendBen()"><i class="fa-solid fa-square-plus fa-fw"></i></button></td>\n</tr>\n</tbody>\n</table>\n</div>\n</div>',data:()=>({total:0,addAccount:"",addWeight:"1.00",bennies:[],favorites:[]}),props:{list:{type:Array,required:!0,default:function(){return[]}},hide:{type:Boolean,default:!0},eq100:{default:!1}},computed:{dlux(){return!!this.bennies.find((t=>"dlux-io"==t.account))?.weight}},emits:["updatebennies"],methods:{appendBen(){""!=this.addAccount&&this.addWeight>0&&(this.checkHive(this.addAccount,parseInt(100*this.addWeight)),this.addAccount="",this.addWeight="1.00")},logIt(t){},incBen(t){(!this.eq100&&this.total<=9900&&t.weight<=9900||this.eq100&&this.total<=1e4&&t.weight<=1e4)&&(this.total+=100,t.weight+=100,this.updateBenny(t.account,t.weight))},decBen(t){t.weight>=100&&(this.total-=100,t.weight-=100,this.updateBenny(t.account,t.weight))},checkHive(t,e){let n=!1;for(let s=0;s<this.bennies.length;s++)if(this.bennies[s].account==t){const t=this.bennies[s].weight;this.bennies[s].weight=e,n=!0,t!=e&&this.finalize()}n||fetch("https://api.hive.blog",{method:"POST",body:JSON.stringify({jsonrpc:"2.0",method:"condenser_api.get_accounts",params:[[t]],id:1})}).then((t=>t.json())).then((n=>{n.result[0].id&&(this.total+=e,this.bennies.push({account:t,weight:e}),this.addFavorite(t),this.finalize())}))},addBenny(t,e){this.checkHive(t,e)},subBenny(t){this.total-=this.bennies.find((e=>e.account==t)).weight,this.bennies=this.bennies.filter((e=>e.account!=t)),this.finalize()},updateBenny(t,e){for(let n=0;n<this.bennies.length;n++)this.bennies[n].account==t&&(this.bennies[n].weight=e);this.finalize()},finalize(){if(this.eq100){this.total=0;for(let t=this.bennies.length-1;t>=0;t--)this.total+=this.bennies[t].weight,this.total>1e4&&(this.bennies[t].weight-=this.total-1e4,this.total=1e4);this.total<1e4?this.bennies[0].weight+=1e4-this.total:this.total>1e4&&(this.bennies[0].weight-=this.total-1e4)}this.$emit("updatebennies",this.bennies)},getFavorites(){let t=localStorage.getItem("favoriteBens");t&&(t=t.split(","),this.favorites=t)},setFavorites(){localStorage.setItem("favoriteBens",this.favorites)},addFavorite(t){this.favorites.includes(t)||(this.favorites.push(t),this.setFavorites())},removeFavorite(t){this.favorites=this.favorites.filter((e=>e!=t)),this.setFavorites()}},watch:{list:{handler:function(t,e){t.forEach((t=>{this.checkHive(t.account,t.weight)}))},deep:!0}},mounted(){this.list.forEach((t=>{this.checkHive(t.account,t.weight)})),this.getFavorites()}};