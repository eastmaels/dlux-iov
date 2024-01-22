import Marker from"/js/marker-min.js";import Ratings from"/js/ratings-min.js";import MDE from"/js/mde-min.js";import Vote from"/js/vote-min.js";import Pop from"/js/pop-min.js";import Replies from"/js/replies-min.js";import Bennies from"/js/bennies-min.js";export default{components:{"vue-markdown":Marker,"vue-ratings":Ratings,mde:MDE,vote:Vote,"pop-vue":Pop,replies:Replies,bennies:Bennies},template:'<div :class="{\'fade\': modal, \'modal\': modal}" id="detailModal" tabindex="-1" role="dialog" aria-hidden="true" @focus="orderBy(\'Reward\')">\n<div class="modal-dialog modal-full modal-xl modal-dialog-centered" style="max-width: 1000px;"\nrole="document">\n<div class="modal-content rounded bg-img-none">\n<div class="card bg-img-none bg-blur-none">\n<div class="ms-auto">\n<button :class="{\'invisible\' : !modal}" type="button" class="btn-close mt-3 me-3"\ndata-bs-dismiss="modal" aria-label="Close"></button>\n<button @click="updateAPP(post, post.subApp)" :class="{\'d-none\' : modal, \'invisible\' : post.author != account}" type="button" class="btn btn-dark mt-3 me-3"\n>Update dApp</button>\n</div>\n<div class="ms-auto me-auto w-100 px-2" style="max-width: 750px">\n<div class="">\n<div class="d-flex">\n<div><a class=" no-decoration" :href="\'/blog/@\' + post.author + \'/\' + post.permlink">\n<h3 class="card-title" id="modal_title">{{post.title}}</h3>\n</a>\n<div class="d-flex flex-wrap text-info" v-if="post.type != \'Blog\'">\n<div>\n<p><i :class="post_select.types[post.type].icon"></i>\n{{post_select.types[post.type].launch}}</p>\n</div>\n<p class="mx-2">•</p>\n<vue-ratings class="d-flex" :stars="post.rating" :ratings="post.ratings">\n</vue-ratings>\n</div>\n</div>\n</div>\n<div class="d-flex align-items-center justify-content-between">\n<a :href="\'/@\' + post.author" class="no-decoration">\n<div class="d-flex align-items-center">\n<img v-if="post.author" :src="\'https://images.hive.blog/u/\' + post.author + \'/avatar\'" :alt="\'https://images.hive.blog/u/\' + post.author" class="rounded-circle bg-light img-fluid me-1 border border-light" style="width: 50px;">\n<div>\n<div class="d-flex align-items-center">\n<h3 class="m-0 text-white-50">{{post.author}}</h3>\n<div>\n<span class="ms-1 badge text-white-50" :class="{\'rep-danger\': post.rep < 25, \'rep-warning\': post.rep >= 25 && post.rep < 50, \'rep-success\': post.rep >= 50}">{{post.rep}}</span>\n</div>\n</div>\n<span class="small text-muted">{{post.ago}}</span>\n</div>\n</div>\n</a>\n<a v-if="post.type != \'Blog\'" :href="\'/dlux/@\' + post.author + \'/\' + post.permlink" target="_blank" class="ms-auto no-decoration"><button class="btn btn-lg btn-danger px-4 d-flex align-items-center" style="border-radius: 5rem;"><span class="d-none d-md-flex me-2">Launch</span><i class="ms-2 fas fa-external-link-alt"></i></button></a>\n<span class="badge bg-primary d-none"><i :class="post_select.types[post.type].icon"></i>{{post.type}}</span>\n</div>\n</div>\n<div>\n<hr>\n</div>\n<div class="mde-body">\n<vue-markdown :md="post.body" :author="post.author" :permlink="post.permlink"></vue-markdown>\n</div>\n<div class="m-auto py-3 text-center" v-if="(post.type == \'Blog\' && !solo) || post.type != \'Blog\'">\n<p><i :class="post_select.types[post.type].icon"></i>{{post_select.types[post.type].launch}}\n</p>\n<a :href="(post.type == \'Blog\' ? \'/blog/@\' : \'/dlux/@\') + post.author + \'/\' + post.permlink"><button class="btn btn-lg btn-danger px-4" style="border-radius: 5rem;">Launch<i class="ms-2 fas fa-external-link-alt"></i></button></a>\n</div>\n<div class="">\n<div class="d-flex align-items-center">\n</div>\n<div class="collapse" :id="\'contract-modal-\' + post.author + \'-\' + post.permlink">\n<h4 class="text-white-50 text-center mt-2">Storage Contract Details</h4>\n<form v-for="(cid, name, index) in post.contract" id="contractForm">\n<div v-if="contracts[name]">\n<div class="d-flex flex-column mb-2">\n<div class="w-100 py-1">\n<div class="d-flex justify-content-between align-items-center">\n<span class="text-break">{{fancyBytes(contracts[name].u)}} | {{expIn(contracts[name])}}</span>\n<button type="button" class="btn btn-sm btn-outline-success" data-bs-toggle="collapse" :data-bs-target="\'#nodes-\' + post.permlink">\n<i class="fa-solid fa-tower-broadcast fa-fw me-1"></i>{{contracts[name].nt}}/{{contracts[name].p}}</button>\n</div>\n<div class="collapse" :id="\'nodes-\' + post.permlink">\n<div class="text-lead text-uppercase text-white-50 pb-05 mt-1 border-bottom">Nodes Storing This Contract</div>\n<ol type="1" class="my-1" v-for="(acc, prop, index) in contracts[name].n">\n<li class="mt-1"><a :href="\'/@\' + acc " class="no-decoration text-info">@{{acc}}</a></li>\n<div v-if="index == Object.keys(contracts[name].n).length - 1 && index + 1 < contracts[name].p" v-for="i in (contracts[name].p - (index + 1))">\n<li>Open</li>\n</div>\n</ol>\n<p class="d-none" v-if="index == Object.keys(contracts[name].n).length - 1 && index + 1 < contracts[name].p">{{contracts[name].p - (index + 1) }} slots are open!</p>\n</div>\n</div>\n</div>\n<div v-if="has_ipfs" class="alert alert-secondary d-flex align-items-center py-1 ps-2 pe-1 mb-2">\n<span class="me-1">{{isStored(contracts[name].i) ? \'Your node is storing this contract\' : \'Your node is not storing this contract\'}}</span>\n<button @click="store(contracts[name].i, isStored(contracts[name].i))" class="btn ms-auto" :class="{\'btn-success\': !isStored(contracts[name].i), \'btn-danger\': isStored(contracts[name].i)}">\n<span v-if="!isStored(contracts[name].i)">\n<i class="fa-solid fa-square-plus fa-fw me-1"></i>Add</span>\n<span v-if="isStored(contracts[name].i)"><i class="fa-solid fa-trash-can fa-fw me-1"></i>Remove</span>\n</button>\n</div>\n<div class="d-flex flex-wrap mb-2">\n<div class="btn-group mt-1">\n<input name="time" @change="updateCost(name);customTime = false" title="1 Day" class="btn-check" :id="\'option1-\' + name" type="radio" value="1" v-model="contracts[name].extend" checked>\n<label class="btn btn-sm btn-outline-info" :for="\'option1-\' + name">1D</label>\n<input name="time" @change="updateCost(name);customTime = false" title="1 Week" class="btn-check" :id="\'option2-\' + name" type="radio" value="7" v-model="contracts[name].extend">\n<label class="btn btn-sm btn-outline-info" :for="\'option2-\' + name">1W</label>\n<input name="time" @change="updateCost(name);customTime = false" title="1 Month" class="btn-check" :id="\'option3-\' + name" type="radio" value="30" v-model="contracts[name].extend">\n<label class="btn btn-sm btn-outline-info" :for="\'option3-\' + name">1M</label>\n<input name="time" @change="updateCost(name);customTime = false" title="1 Year" class="btn-check" :id="\'option4-\' + name" type="radio" value="365" v-model="contracts[name].extend">\n<label class="btn btn-sm btn-outline-info" :for="\'option4-\' + name">1Y</label>\n</div>\n<div class="input-group flex-nowrap col ms-1 mt-1">\n<input type="number" step="1" class="form-control px-1 btn-sm text-end border-info text-info" v-model="contracts[name].extend" @change="updateCost(name)" style="min-width: 60px;">\n<span class="input-group-text btn-sm">Days</span>\n</div>\n</div>\n<div class="mb-2 d-flex flex-wrap text-nobreak align-items-center text-white-50">\n<button type="button" class="btn btn-sm btn-primary mt-1" :disabled="extendcost[name] > broca_calc(broca)" @click="extend(contracts[name], extendcost[name])">\n<i class="fa-solid fa-clock-rotate-left fa-fw me-1"></i>Extend</button>\n<button type="button" class="btn btn-sm btn-warning ms-1 mt-1" v-if="contracts[name].t == account" @click="cancel_contract(contracts[name])">\n<i class="fa-solid fa-file-circle-xmark fa-fw me-1"></i>Sever</button>\n<button type="button" class="btn btn-sm btn-secondary ms-1 mt-1" data-bs-toggle="collapse" :data-bs-target="\'#contract-modal-\' + post.author + \'-\' + post.permlink">\n<i class="fa-solid fa-xmark fa-fw"></i></button>\n<div class="d-flex align-items-center text-nobreak ms-1 mt-1 btn btn-sm btn-outline-secondary p-0">\n<label :for="\'spread-\' + name" role="button" class="ps-1">&nbsp;</label>\n<input class="form control" :id="\'spread-\' + name" type="checkbox" role="button" v-model="spread" @change="updateCost(name)">\n<label :for="\'spread-\' + name" role="button" class="px-1 py-05">Add<i class="fa-solid fa-tower-broadcast fa-fw ms-1"></i></label>\n</div>\n<div class="ms-auto mt-1 text-primary fw-bold">{{formatNumber(extendcost[name], 0, \'.\',\',\')}} Broca</div>\n</div>\n</div>\n</form>\n</div>\n<div class="collapse" :id="\'vote-modal-\' + post.author + \'-\' + post.permlink">\n<form id="voteForm">\n<div class="d-flex align-items-center text-white-50">\n<button type="button" class="btn btn-sm me-1" :class="{\'btn-success\': !flag, \' btn-danger\': flag}" @click="vote(post.url)" style="min-width: 85px;"><span v-if="!flag"><i class="fas fa-heart fa-fw me-1"></i></span><span v-if="flag"><i class="fa-solid fa-flag me-1"></i></span>{{flag ? \'-\' : \'\'}}{{formatNumber(slider / 100, 0,\'.\',\',\')}}%</button>\n<button type="button" class="btn btn-sm btn-secondary px-1 me-1" data-bs-toggle="collapse" :data-bs-target="\'#vote-modal-\' + post.author + \'-\' + post.permlink">\n<i class="fa-solid fa-xmark fa-fw"></i></button>\n<input type="range" class="form-range mx-2" step="1" max="10000" v-model="slider">\n<span style="min-width: 100px" class="text-end text-nowrap" id="commentVal" :class="{\'text-success\': !flag, \'text-danger\': flag}">{{toFixed(voteval * slider/10000,3)}}\n<i class="fab fa-fw fa-hive"></i>\n</span>\n</div>\n</form>\n</div>\n</div>\n</div>\n<div class="my-2 p-2" style="border-top: solid 1px rgba(0,0,0,1); border-bottom: solid 1px rgba(255,255,255,0.4);">\n<div class="ms-auto me-auto" style="max-width: 750px">\n<div class="d-flex align-items-center">\n<a role="button" @click="flag = false" class="no-decoration" data-bs-toggle="collapse" :data-bs-target="\'#vote-modal-\' + post.author + \'-\' + post.permlink"><i class="fas fa-heart fa-fw me-1"></i><span class="text-white-50">{{post.upVotes}}</span>\n</a>\n<a href="#comments" class="no-decoration">\n<i class="fas fa-comment fa-fw ms-2 me-1"></i><span class="text-white-50">{{post.children}}</span>\n</a>\n<a role="button" class="no-decoration text-white-50" data-bs-toggle="collapse" :class="{\'text-primary\': flag > 0}" :data-bs-target="\'#vote-modal-\' + post.author + \'-\' + post.permlink" @click="flag = true">\n<i class="fa-solid fa-flag fa-fw ms-2 me-1"></i><span class="text-white-50">{{post.downVotes ? post.downVotes : \'\'}}</span>\n</a>\n<a role="button" v-for="(contract, name, index) in post.contract" class="no-decoration text-white-50" data-bs-toggle="collapse" :data-bs-target="\'#contract-modal-\' + post.author + \'-\' + post.permlink">\n<i class="fa-solid fa-file-contract fa-fw ms-2 me-1" :class="{\'text-success\': color_code(name) > 28800 * 7,\'text-warning\': color_code(name) < 28800 * 7 &&  color_code(name) > 28800, \'text-warning\': color_code(name) < 28800}"></i>\n</a>\n<div class="ms-auto" id="modal_total_payout"><pop-vue title="Post Earnings" :id="\'popper-\' + post.author + \'-\' + post.permlink" :content="(gt(post.total_payout_value, post.pending_payout_value) ? formatNumber(post.total_payout_value + \' \' + post.curator_payout_value, 3, \'.\',\',\') + \' HBD\' : post.pending_payout_value ? post.pending_payout_value : \'\') + \'<br>\' + (post.paid ? precision(post.payout, 3) : 0) + \' \' + TOKEN" trigger="hover">\n<button class="btn btn-sm btn-outline-light">\n{{ gt(post.total_payout_value, post.pending_payout_value) ? formatNumber(post.total_payout_value + \' \' + post.curator_payout_value, 3, \'.\',\',\') : formatNumber(post.pending_payout_value, 3, \'.\',\',\')}}<i class="ms-1 fab fa-fw fa-hive"></i>\n</button>\n</pop-vue>\n</div>\n</div>\n</div>\n</div>\n<div class="px-2">\n<div class="mb-3 ms-auto me-auto" style="max-width: 750px">\n<form id="commentForm">\n<mde id="body" @data="settext($event)" />\n</form>\n<div class="collapse" id="bene-collapse">\n<bennies :list="bens" @update-bennies="bens=$event"></bennies>\n</div>\n<div class="d-flex align-items-center">\n<button class="btn btn-sm px-2 btn-secondary" data-bs-toggle="collapse" data-bs-target="#bene-collapse"><i class="fa-solid fa-user-group fa-fw me-1"></i>Beneficiaries {{bens.length ? \'(\' + bens.length + \')\' : \'\'}}<span v-if="!bens.length">+</span></button>\n<vue-ratings v-if="post.type != \'Blog\'" role="button" class="ms-2" vote="true" @rating="setRating(post.url, $event)"></vue-ratings>\n<button class="ms-auto btn btn-sm px-2 btn-primary" :disabled="!mde" @click="comment(post.url)"><i class="fas fa-comment fa-fw me-1"></i>Reply</button>\n</div>\n</div>\n</div>\n<div class="bg-darkest border-1 border-start border-end p-1"></div>\n<div id="comments" class="replies w-100 ms-auto me-auto px-2 mb-3" style="max-width: 750px">\n<div class="d-flex text-nobreak align-items-center my-2">\n<h5 class="m-0">{{post.children}} Comment<span v-if="post.children > 1">s</span></h5>\n<div class="dropdown ms-auto">\n<button class="btn btn-sm btn-dark px-2 text-uppercase" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{orderby}}<i class="fa-solid fa-arrow-down-wide-short fa-fw ms-1"></i>\n</button>\n<ul class="dropdown-menu dropdown-menu-dark bg-black">\n<li><a class="dropdown-item" role="button" @click="orderBy(\'Reward\')">Reward</a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'RateUp\')">Ratings<i class="fa-solid fa-arrow-down-wide-short"></i></a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'RateDown\')">Ratings<i class="fa-solid fa-arrow-down-short-wide"></i></a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'Newest\')">Newest</a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'AuthorVote\')">Author Vote</a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'Oldest\')">Oldest</a></li>\n<li><a class="dropdown-item" role="button" @click="orderBy(\'Rep\')">Reputation</a></li>\n</ul>\n</div>\n</div>\n<div v-for="post in post.replies" :key="post.url">\n<replies :post="post" :account="account" :voteval="voteval" @vote="vote($event)" @reply="reply($event)"/>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>',props:{head_block:{default:0},has_ipfs:{default:!1},solo:{default:!1},TOKEN:{default:"DLUX"},hide:{default:!0},modal:{default:!0},post:{required:!0,default:function(){return{}}},account:{default:""},voteval:0,post_select:{default:function(){return{}}},contracts:{default:function(){return{}}},extendcost:{default:function(){return{}}},broca_refill:{default:0},broca:{default:0},spk_power:{default:0}},data:()=>({collapse:!1,hideBens:!0,edit:!1,view:!0,mde:"",makeReply:!1,spread:!1,warn:!1,flag:!1,slider:1e4,orderby:"Reward",bens:[],postCustom_json:{review:{rating:0}}}),emits:["vote","reply","modalselect","tosign"],methods:{orderBy(t){if(this.orderby=t,this.post?.replies?.length)switch(t){case"Reward":this.post.replies.sort(((t,e)=>parseFloat(e.total_payout_value)||parseFloat(t.total_payout_value)?parseFloat(e.total_payout_value)-parseFloat(t.total_payout_value):parseFloat(e.pending_payout_value)-parseFloat(t.pending_payout_value)));break;case"Newest":this.post.replies.sort(((t,e)=>Date.parse(e.created+".000")-Date.parse(t.created+".000")));break;case"AuthorVote":this.post.replies.sort(((t,e)=>t.active_votes.find((t=>t.voter===this.post.author))-e.active_votes.find((t=>t.voter===this.post.author))));break;case"Oldest":this.post.replies.sort(((t,e)=>Date.parse(t.created+".000")-Date.parse(e.created+".000")));break;case"Rep":this.post.replies.sort(((t,e)=>e.author_reputation-t.author_reputation));break;case"RateUp":this.post.replies.sort(((t,e)=>e.rating-t.rating));break;case"RateDown":this.post.replies.sort(((t,e)=>t.rating-e.rating));break;default:break}},settext(t){this.mde=t},expIn(t){return"Expires in "+(parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60)<24?parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60)+" hours":parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60/24)+" days")},color_code(t){return parseInt(this.contracts[t]?this.contracts[t].e.split(":")[0]:0)-this.head_block},modalSelect(t){this.$emit("modalselect",t)},isStored(t){var e=!1;for(var s in this.contracts[t].n)if(this.contracts[t].n[s]==this.account){e=!0;break}return e},extend(t,e,s=!1){if(e>this.broca_calc(this.broca))return;const a={type:"cja",cj:{broca:e,id:t.i,file_owner:t.t,power:s?1:0},id:"spkcc_extend",msg:`Extending ${t}...`,ops:["getTokenUser"],api:"https://spktest.dlux.io",txid:"extend"};this.$emit("tosign",a)},updateCost(t){this.extendcost[t]=parseInt(this.contracts[t].extend/30*this.contracts[t].r),this.$forceUpdate()},getContracts(){var t=[],e=t=>{fetch("https://spktest.dlux.io/api/fileContract/"+t).then((t=>t.json())).then((e=>{e.result.extend="7",e.result&&(this.contracts[t]=e.result,this.extendcost[t]=parseInt(e.result.extend/30*e.result.r))}))};for(var s in this.post.contract)t.push(s);t=[...new Set(t)];for(var a=0;a<t.length;a++)e(t[a])},imgUrlAlt(t){t.target.src="/img/dlux-logo-icon.png"},picFind(t){var e;try{e=t.image[0]}catch(t){}return"string"==typeof t.image?t.image:"string"==typeof e?e:"string"==typeof t.Hash360?`https://ipfs.dlux.io/ipfs/${t.Hash360}`:"/img/dluxdefault.png"},pending(t){this.mde=t},vote(t){this.$emit("vote",{url:`/@${this.post.author}/${this.post.permlink}`,slider:this.slider,flag:this.flag})},store(t,e=!1){const s={type:"cja",cj:{items:[t]},id:"spkcc_"+(e?"remove":"store"),msg:`Storing ${t}...`,ops:["getTokenUser"],api:"https://spktest.dlux.io",txid:`${t}_${e?"remove":"store"}`};this.$emit("tosign",s)},updateAPP(t,e="360"){switch(e){case"360":t.json_metadata.vrHash="QmZF2ZEZK8WBVUT7dnQyzA6eApLGnMXgNaJtWHFc3PCpqV";break;default:return}t.json_metadata.subApp=e;const s={type:"raw",op:[["comment",{parent_author:t.parent_author,parent_permlink:t.parent_permlink,author:t.author,permlink:t.permlink,title:t.title,body:t.body,json_metadata:JSON.stringify(t.json_metadata)}]],key:"posting",msg:"Updating...",ops:["checkAccount"],api:"https://api.hive.blog",txid:`Updating @${t.author}/${t.permlink}`};this.$emit("tosign",s)},updateCost(t){this.extendcost[t]=parseInt(this.contracts[t].extend*(this.contracts[t].p+(this.spread?1:0))/90*this.contracts[t].r),this.$forceUpdate()},getContracts(){var t=[],e=t=>{fetch("https://spktest.dlux.io/api/fileContract/"+t).then((t=>t.json())).then((e=>{e.result.extend="7",e.result&&(this.contracts[t]=e.result,this.extendcost[t]=parseInt(e.result.extend/30*e.result.r))}))};for(var s in this.post.contract)t.push(s);t=[...new Set(t)];for(var a=0;a<t.length;a++)e(t[a])},timeSince(t){var e=Math.floor((new Date-new Date(t+".000Z"))/1e3),s=Math.floor(e/86400);return s>7?new Date(t).toLocaleDateString():s>=1?s+` day${s>1?"s":""} ago`:(s=Math.floor(e/3600))>=1?s+` hour${s>1?"s":""} ago`:(s=Math.floor(e/60))>=1?`${s} minute${s>1?"s":""} ago`:Math.floor(e)+" seconds ago"},setReply(t){this.mde=t},reply(t){t||(t={parent_author:this.post.author,parent_permlink:this.post.permlink,author:this.account,permlink:"re-"+this.post.permlink,title:"",body:this.mde,json_metadata:JSON.stringify(this.postCustom_json)},this.bens.length&&(t.bens=this.bens)),this.$emit("reply",t)},comment(t){if(this.mde){var e={parent_author:this.post.author,parent_permlink:this.post.permlink,author:this.account,permlink:"re-"+this.post.permlink,title:"",body:this.mde,json_metadata:JSON.stringify(this.postCustom_json)};this.bens.length&&(e.bens=this.bens),this.$emit("reply",e)}},broca_calc(t="0,0"){t||(t="0,0");const e=this.Base64toNumber(t.split(",")[1]),s=parseInt(parseFloat(this.broca_refill)*(this.head_block-e)/(1e3*this.spk_power));var a=parseInt(t.split(",")[0])+s;return a>1e3*this.spk_power&&(a=1e3*this.spk_power),a},Base64toNumber(t){var e=0;t=t.split("");for(var s=0;s<t.length;s++)e=64*e+"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=".indexOf(t[s]);return e},formatNumber(t=1,e,s,a){if("number"!=typeof t){const e=t?t.split(" "):[];var n=0;for(r=0;r<e.length;r++)parseFloat(e[r])>0&&(n+=parseFloat(e[r]));t=n>parseFloat(t)?n:parseFloat(t)}if(isNaN(t))return"Invalid Number";if(!isFinite(t))return(t<0?"-":"")+"infinite";s=s||".",a=a||"";var o=t<0;t=Math.abs(t);var i=(null!=e&&0<=e?t.toFixed(e):t.toString()).split("."),r=i[0],l=1<i.length?s+i[1]:"";if(a)for(var p=/(\d+)(\d{3})/;p.test(r);)r=r.replace(p,"$1"+a+"$2");return(o?"-":"")+r+l},gt:(t,e)=>parseFloat(t)>parseFloat(e),precision:(t,e)=>parseFloat(t/Math.pow(10,e)).toFixed(e),toFixed:(t,e)=>parseFloat(t).toFixed(e),hideLowRep(){"..."!=this.post.rep?parseFloat(this.post.rep)<25&&(this.view=!1,this.warn=!0):setTimeout(this.hideLowRep,1e3)},setRating(t,e){this.postCustom_json.review.rating=e},fancyBytes(t){for(var e=0;t>1024;)t/=1024,e++;return`${this.toFixed(t,2)} ${["","K","M","G","T","P","E","Z","Y"][e]}B`},expIn(t){return"Expires in "+(parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60)<24?parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60)+" hours":parseInt((parseInt(t.e.split(":")[0])-this.head_block)/20/60/24)+" days")}},mounted(){this.hideLowRep(),this.getContracts()}};