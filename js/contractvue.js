import Pop from "/js/pop-min.js";
import ExtensionVue from "/js/extensionvue.js";
import FilesVue from "/js/filesvue.js";
import UploadVue from "/js/uploadvue.js";
import ModalVue from "/js/modalvue.js";
import PostVue from "/js/postvue.js";

export default {
    components: {
        "pop-vue": Pop,
        "extension-vue": ExtensionVue,
        "files-vue": FilesVue,
        "upload-vue": UploadVue,
        "modal-vue": ModalVue,
        "post-vue": PostVue
    },
    template: `
    <div class="d-flex justify-content-center mt-2">
    <!-- register account -->
    <div v-if="saccountapi.pubKey == 'NA'" class="d-flex">
        <div class="d-flex justify-content-center p-3">
            <div class="text-center" style="max-width: 600px;">
                <p class="lead">Join the SPK Network to store your files on IPFS</p>
                <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-primary" @click="updatePubkey()">
                <i class="fa-solid fa-user-plus fa-fw me-1"></i> Register Account
                </button>
                <button type="button" class="ms-2 btn btn-secondary d-flex" data-bs-toggle="modal" data-bs-target="#spkWalletModal">
                    <i class="fa-solid fa-wallet fa-fw me-1 my-auto"></i>
                    <span class="my-auto">SPK</span>
                    <span class="badge small text-bg-warning ms-1 mb-auto" style="font-size: 0.5em;">Test</span>
                </button>
                </div>
            </div>
        </div>
    </div>
    <!-- tabs nav -->
    <div v-if="saccountapi.pubKey != 'NA'" class="d-flex flex-column w-100">
        <ul class="nav nav-pills ms-auto me-auto mb-2">

            <li class="nav-item">
                <a class="nav-link active" href="#contractsTab" role="tab" data-bs-toggle="tab"
                    aria-controls="contractstab" aria-expanded="true"><i class="fa-solid fa-list fa-fw"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link " aria-current="page" href="#filesTab" role="tab" data-bs-toggle="tab"
                    aria-controls="filestab" aria-expanded="false"><i class="fa-solid fa-cloud fa-fw"></i></a>
            </li>
        </ul>
        <!-- tabs -->
        <div class="tab-content bg-color">
            <!-- files -->
            <div role="tabpanel" class="tab-pane" id="filesTab" aria-labelledby="filestab">
                <!-- no files -->
                <div v-if="hasFiles" class="ms-auto me-auto text-center">
                    <div class="ms-auto me-auto card px-3 py-2 mt-3 mb-4 bg-darker" style="max-width: 600px">
                        <h2 class="fw-light mt-1">No files found</h2>
                        <p class="lead mb-1" v-if="!nodeview">
                            Click <a class="btn btn-sm btn-primary no-decoration small" style="font-size: 0.6em;"
                                role="button" data-bs-toggle="tab" href="#contractsTab"><i
                                    class="fa-solid fa-list fa-fw me-1"></i>Contracts Tab
                            </a> to upload files
                        </p>
                    </div>
                </div>
                <!-- has files -->
                <div v-if="!hasFiles" class="d-flex flex-wrap justify-content-center">
                    <div class="d-flex flex-wrap justify-content-center" v-for="contract in contracts">
                        <files-vue :assets="assets" @addassets="addAssets($event)"
                            :contract="contract"></files-vue>
                    </div>
                </div>
            </div>
            <!-- contracts -->
            <div role="tabpanel" class="tab-pane show active" id="contractsTab" aria-labelledby="contractstab">
                <!-- top menu -->
                <div class="card-header mb-2 d-flex flex-wrap justify-content-center align-items-center">
                    <h2 class="my-1 ms-lg-3 fw-light text-start">{{title}}</h2>
                    <div class="d-flex flex-wrap flex-grow-1 mx-lg-3">
                        <!-- tools 1 -->
                        <div class="d-flex mb-1 flex-wrap ms-auto order-lg-last">
                            <div class="d-flex flex-wrap justify-content-center ms-auto me-auto">

                                <!-- new contract button -->
                                <button v-if="saccountapi.pubKey != 'NA' && saccountapi.spk_power" type="button"
                                    class="btn btn-primary mt-1 me-1">
                                    <modal-vue type="build" token="BROCA" :balance="broca_calc(saccountapi.broca)"
                                        :account="account" @modalsign="toSign=$event" :ipfsproviders="ipfsProviders"
                                        v-slot:trigger>
                                        <span slot="trigger" class="trigger"><i
                                                class="fa-solid fa-file-contract fa-fw me-1"></i>NEW</span>
                                    </modal-vue>
                                </button>

                                <!-- free button -->
                                <button v-if="saccountapi.pubKey != 'NA'" type="button" class="btn btn-danger mt-1 me-1"
                                    data-bs-toggle="modal" data-bs-target="#sponsoredModal">
                                    <span class=""></span><i class="fa-solid fa-wand-magic-sparkles fa-fw me-1"></i>FREE
                                </button>

                                <!-- spk wallet button -->
                                <button v-if="!nodeview" type="button" class="mt-1 btn btn-secondary d-flex" data-bs-toggle="modal" data-bs-target="#spkWalletModal">
                                    <i class="fa-solid fa-wallet fa-fw me-1 my-auto"></i>
                                    <span class="my-auto">SPK</span>
                                    <span class="badge small text-bg-warning ms-1 mb-auto" style="font-size: 0.5em;">Test</span>
                                </button>
                                
                            </div>
                        </div>
                        <!-- tools 2 (hidden) -->
                        <div>
                            <div
                                class="d-none position-relative flex-grow-1 me-1 order-lg-first d-flex align-items-center">
                                <!-- search bar -->
                                <span class="flex-grow-1">
                                    <span class="position-absolute ps-2 top-50 translate-middle-y">
                                        <i class="fa-solid fa-magnifying-glass fa-fw"></i>
                                    </span>
                                    <input type="search" class="ps-4 form-control text-info border-light"
                                        placeholder="Search" @keyup.enter="postSelect.entry = 'search';getPosts()"
                                        @search="postSelect.entry = 'search';getPosts()">
                                </span>
                                <!-- filter button -->
                                <button type="button" class="btn btn-secondary ms-1">
                                    <span class=""></span><i class="fa-solid fa-filter"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <!-- registered -->
                    <div v-if="saccountapi.pubKey != 'NA'">
                        
                        <!-- no contracts -->
                        <div v-show="!contracts.length"> 
                        <div class="ms-auto me-auto d-flex justify-content-center">
                            <div class="card mx-1 px-3 py-2 mt-3 mb-4 bg-darker" style="max-width: 600px">
                                <h2 class="fw-light mt-1">No contracts found</h2>
                                <p class="lead mb-1" v-if="!nodeview">
                                    Click <a class="btn btn-sm btn-danger no-decoration small" style="font-size: 0.6em;"
                                        role="button" data-bs-toggle="modal" data-bs-target="#sponsoredModal"><i
                                            class="fa-solid fa-wand-magic-sparkles fa-fw me-1"></i>FREE</a>
                                    to select a sponsored contract. 
                                    <span v-show="saccountapi.spk_power"> If
                                        you have BROCA token, click <a
                                            class="btn btn-sm btn-primary no-decoration small" style="font-size: 0.6em;"
                                            role="button" data-bs-toggle="modal" data-bs-target="#contractModal">
                                            <modal-vue type="build" token="BROCA"
                                                :balance="broca_calc(saccountapi.broca)" :account="account"
                                                @modalsign="toSign=$event" :ipfsproviders="ipfsProviders"
                                                v-slot:trigger>
                                                <span slot="trigger" class="trigger"><i
                                                        class="fa-solid fa-file-contract fa-fw me-1"></i>NEW</span>
                                            </modal-vue></a>
                                        to create a custom contract
                                    </span>
                                </p>
                            </div>
                        </div>
                        </div>

                        <!-- contracts -->
                        <div v-show="contracts.length">
                            <table class="table table-hover text-center align-middle mb-0" id="files-table">
                                <thead>
                                    <tr>
                                        <!-- storage -->
                                        <th scope="col">
                                            <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                    <i class="fa-solid fa-database fa-fw"></i>
                                                    <span class="m-1">Storage</span>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <button class="btn btn-sm btn-secondary"
                                                        @click="sortContracts('a','asc')"><i
                                                            class="fa-solid fa-caret-up"></i></button>
                                                    <button class="btn btn-sm btn-secondary ms-1"
                                                        @click="sortContracts('a','dec')"><i
                                                            class="fa-solid fa-caret-down"></i></button>
                                                </div>
                                            </div>
                                        </th>


                                        <!-- status -->
                                        <th scope="col">
                                            <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                    <i class="fa-solid fa-signal fa-fw"></i>
                                                    <span class="m-1">Status</span>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <button class="btn btn-sm btn-secondary ms-1"
                                                        @click="sortContracts('c','asc')"><i
                                                            class="fa-solid fa-caret-up"></i></button>
                                                    <button class="btn btn-sm btn-secondary ms-1"
                                                        @click="sortContracts('c','dec')"><i
                                                            class="fa-solid fa-caret-down"></i></button>
                                                </div>
                                            </div>
                                        </th>

                                        <!-- expires -->
                                        <th scope="col">
                                            <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                <div class="d-flex flex-wrap align-items-center justify-content-center">
                                                    <i class="fa-solid fa-clock fa-fw"></i>
                                                    <span class="m-1">Expires</span>
                                                </div>
                                                <div class="d-flex align-items-center">
                                                    <button class="btn btn-sm btn-secondary"
                                                        @click="sortContracts('e','dec')"><i
                                                            class="fa-solid fa-caret-up"></i></button>
                                                    <button class="btn btn-sm btn-secondary ms-1"
                                                        @click="sortContracts('e','asc')"><i
                                                            class="fa-solid fa-caret-down"></i></button>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="contract in contracts" class="text-start">
                                        <td colspan="4" class="p-0">
                                            <div class="table-responsive">
                                                <table class="table text-white align-middle mb-0">
                                                    <tbody class="border-0">
                                                        <tr class="border-0 click-me" data-bs-toggle="collapse" :href="'#' + replace(contract.i)" aria-expanded="false" aria-controls="collapseExample">

                                                            <!-- storage -->
                                                            <th class="border-0">
                                                                <div class="d-flex align-items-center">
                                                                    <div class="border border-1 border-light text-light rounded p-05 me-2">
                                                                        <i class="fa-solid fa-file fa-fw"></i>
                                                                    </div>
                                                                    <div>
                                                                        {{contract.c > 1 ? contract.u/1000000 : contract.a/1000000}} MB
                                                                    </div>
                                                                </div>
                                                            </th>

                                                            <!-- status -->
                                                            <td class="border-0">
                                                                <div class="d-flex align-items-center">

                                                                    <!-- upload btn -->
                                                                    <div v-if="contract.c == 1" class="border border-1 border-success text-success rounded p-05 me-2">
                                                                        <i class="fa-solid fa-file-upload fa-fw"></i>
                                                                    </div>
                                                                    
                                                                    <!-- post btn -->
                                                                    <div v-if="contract.c == 2" class="border border-1 border-warning text-warning rounded p-05 me-2">
                                                                        <i class="fa-solid fa-hand-holding-dollar fa-fw"></i>
                                                                    </div>
                                                                   
                                                                    <!-- extend btn -->
                                                                    <div v-if="contract.c == 3" class="border border-1 border-primary text-primary rounded p-05 me-2">
                                                                        <i class="fa-solid fa-clock-rotate-left fa-fw"></i>
                                                                    </div>

                                                               
                                                                   
                                                                    <!-- message -->
                                                                    <div v-if="contract.c == 1">
                                                                            <span class="d-lg-none">Upload</span>
                                                                            <span class="d-none d-lg-flex">Ready for
                                                                                upload</span>
                                                                    </div>
                                                                    <div v-if="contract.c == 2">
                                                                            <span class="d-lg-none">Post</span>
                                                                            <span class="d-none d-lg-flex">Post
                                                                                {{split(contract.s, ',', 1)/100}}% to @{{split(contract.s, ',', 0)}}</span>
                                                                    </div>
                                                                    <div v-if="contract.c == 3">
                                                                            <span class="d-lg-none">Extend</span>
                                                                            <span class="d-none d-lg-flex align-items-center"> {{contract.nt}} /
                                                                                {{contract.p}}  <i class="fa-solid fa-tower-broadcast mx-1 fa-fw"></i> nodes </span>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <!-- expires -->
                                                            <td class="border-0">
                                                                <div class="d-flex align-items-center">
                                                                    <div class="border border-1 border-light text-light rounded p-05 me-2">
                                                                        <i class="fa-solid fa-circle-info fa-fw"></i>
                                                                    </div>
                                                                    
                                                                    <span v-if="contract.c">
                                                                        {{exp_to_time(contract.e)}}
                                                                    </span>

                                                                </div>
                                                            </td>
                                                        </tr>

                                                        <!-- collapse region -->

                                                        <!-- detail view -->
                                                        <tr class="collapse" :id="replace(contract.i)">
                                                            <td class="border-0" colspan="4">
                                                                <div class="d-flex flex-column border border-white rounded text-start p-2" style="background-color:rgba(0,0,0,0.3);">

                                                                    

                                                                    <!-- upload -->
                                                                    <div v-if="contract.c == 1" class="mb-3">
                                                                        <upload-vue :user="saccountapi" :propcontract="contract" @tosign="toSign=$event" @done="done()" />
                                                                    </div>

                                                                    <!-- post -->
                                                                    <div v-if="account == contract.t && !postpage && contract.c == 2" class="mb-3">
                                                                        <post-vue :account="account"
                                                                        :prop_bens="[contract.s]"
                                                                        :prop_links="links[contract.i]"
                                                                        @tosign="toSign=$event" />
                                                                    </div>

                                                                    

                                                                    <!-- files list -->
                                                                    <div v-if="contract.df" class="card mx-auto p-4 mb-3 bg-img-none bg-blur-darkg">

                                                                        <div class="d-flex flex-column">
                                                                            <h4 class="ms-auto me-auto">Files <i class="fa-solid fa-fw ms-1 fa-paperclip"></i></h4>
                                                                            <ol class="text-start mx-auto">
                                                                                <li class="mb-2" v-for="(size, cid, index) in contract.df">
                                                                                    <div class="d-flex align-content-center">    
                                                                                        <div class="d-flex mx-2">
                                                                                            <img class="img-thumbnail" :src="smartThumb(contract.i,index,cid)" width="100px">
                                                                                        </div>
                                                                                        <div class="d-flex flex-column my-auto"> 
                                                                                            <div class="d-flex mb-1">
                                                                                                <div class="me-1">
                                                                                                    <div class="position-relative has-validation">
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 1]" placeholder="File Name" pattern="[a-zA-Z0-9_\-]{3,25}" class="form-control form-control-sm bg-dark border-dark text-info">
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="mx-1">
                                                                                                    <div class="position-relative has-validation">
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 2]" placeholder="File Type" pattern="[a-zA-Z0-9]{1,4}" class="form-control form-control-sm bg-dark border-dark text-info">
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="ms-1">
                                                                                                    <div class="position-relative has-validation">
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 3]" placeholder="Thumbnail" pattern="https:\/\/[a-z0-9.-\/]+|Qm[a-zA-Z0-9]+" class="form-control form-control-sm bg-dark border-dark text-info">
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="d-flex mb-1">
                                                                                                <a :href="'https://ipfs.dlux.io/ipfs/' + cid" target="_blank" class="no-decoration text-break text-primary">{{cid}}
                                                                                                <i class="ms-2 fa-solid fa-fw fa-up-right-from-square"></i></a>
                                                                                                <span class="small ms-1">({{size > 1 ? size/1000000 : size/1000000}} MB)</span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            </ol>
                                                                            <div class="d-flex">
                                                                                <button type="button" class="btn btn-sm btn-info my-2 mx-auto" @click="update_meta(contract.i)">
                                                                                    <i class="fa-solid fa-floppy-disk fa-fw me-1"></i>Update Metadata</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- contract ID -->
                                                                    <div class="d-flex flex-wrap justify-content-center mb-2 ">
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 small muted">
                                                                            <div> Contract ID </div>
                                                                            <i class="fa-solid fa-file-contract fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{contract.i}}</div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- extension -->
                                                                    <div v-if="contract.c == 3">
                                                                        <extension-vue :node-view="nodeview"
                                                                        :contract="contract" :sstats="sstats"
                                                                        :account="account" :saccountapi="saccountapi" :spkapi="spkapi"
                                                                        @tosign="toSign=$event"></extension-vue>
                                                                    </div>

                                                                    <!-- contract details -->
                                                                    <div class="d-flex flex-wrap justify-content-center mb-3 ">

                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Owner </div>
                                                                            <i class="fa-solid fa-user fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div><a :href="'/@' + contract.t"
                                                                            class="no-decoration text-primary">@{{contract.t}}</a></div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Sponsor </div>
                                                                            <i class="fa-solid fa-user-shield fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div><a :href="'/@' + contract.f"
                                                                            class="no-decoration text-primary">@{{contract.f}}</a></div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Service Provider </div>
                                                                            <i class="fa-solid fa-user-gear fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div><a :href="'/@' + contract.b"
                                                                            class="no-decoration text-primary">@{{contract.b}}</a></div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Size </div>
                                                                            <i class="fa-solid fa-warehouse fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{contract.c > 1 ? contract.u/1000000 :
                                                                            contract.a/1000000}} MB</div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Redundancy </div>
                                                                            <i class="fa-solid fa-tower-broadcast fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{contract.p}} nodes</div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Expiration </div>
                                                                            <i class="fa-solid fa-clock fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{exp_to_time(contract.e)}}</div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Price </div>
                                                                            <i class="fa-solid fa-atom fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{formatNumber(contract.r,'3','.',',')}}
                                                                            Broca</div>
                                                                        </div>
                                                                        <div v-if="contract.s" class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Terms </div>
                                                                            <i class="fa-solid fa-hand-holding-dollar fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div>{{slotDecode(contract.s, 1)}}%
                                                                            Beneficiary to <a :href="'/@' + slotDecode(contract.s, 0)"
                                                                            class="no-decoration text-primary">@{{slotDecode(contract.s, 0)}}</a></div>
                                                                        </div>
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Status </div>
                                                                            <i class="fa-solid fa-signal fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div> {{contract.c == 1 ? 'Waiting For Upload' : 'Uploaded'}}</div>
                                                                        </div>
                            
                                                                    </div>

                                                                    <div class="d-flex">
                                                                        <button type="button" class="btn btn-sm btn-danger my-2 mx-auto" @click="cancel_contract(contract)">
                                                                        <i class="fa-solid fa-file-circle-xmark fa-fw me-1"></i>End Contract</button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`,
    props: {
        account: {
            default: ''
        },
        sapi: {
            default: 'https://spktest.dlux.io'
        },
        nodeview: {
            default: false
        },
        prop_contracts: {
            default: function () {
                return []
            }
        },
        files: {
            type: Object,
            default: {},
        },
        assets: {
            default: false,
            required: false
        },
        title: {
            default: 'Storage Contracts',
            required: false
        },
        postpage: {
            default: false,
            required: false
        },
        accountinfo: {
            default: function () {
                return {}
            },
            required: false
        },
        spkapi: {
            default: function () {
                return {}
            },
            required: false
        }
    },
    data() {
        return {
            contracts: [],
            newMeta: {},
            state2contracts: [],
            tick: "1",
            toSign: {},
            larynxbehind: 999999,
            lbalance: 0,
            lbargov: 0,
            spkval: 0,
            sstats: {},
            links: {},
            contractIDs: {},
            saccountapi: {
                spk: 0,
                balance: 0,
                gov: 0,
                poweredUp: 0,
                claim: 0,
                granted: {
                    t: 0
                },
                granting: {
                    t: 0
                }
            },
            ipfsProviders: {},
            tokenGov: {
                title: "SPK VOTE",
                options: [
                    {
                        id: "spk_cycle_length",
                        range_low: 28800,
                        range_high: 2592000,
                        info: "Time in blocks to complete a power down cycle. 4 cycles to completely divest. 28800 blocks per day.",
                        val: 200000,
                        step: 1,
                        unit: "Blocks",
                        title: "Down Power Period"
                    },
                    {
                        id: "dex_fee",
                        range_low: 0,
                        range_high: 0.01,
                        info: "Share of DEX completed DEX trades to allocate over the collateral group.",
                        val: 0.00505,
                        step: 0.000001,
                        unit: "",
                        title: "DEX Fee"
                    },
                    {
                        id: "dex_max",
                        range_low: 28800,
                        range_high: 2592000,
                        info: "Largest open trade size in relation to held collateral.",
                        val: 97.38,
                        step: 1,
                        unit: "%",
                        title: "Max Trade Size"
                    },
                    {
                        id: "dex_slope",
                        range_low: 0,
                        range_high: 100,
                        info: "0 Allows any size buy orders to be placed. 1 will disallow large buy orders at low prices.",
                        val: 48.02,
                        step: 0.01,
                        unit: "%",
                        title: "Max Lowball Trade Size"
                    },
                    {
                        id: "spk_rate_ldel",
                        range_low: 0.00001, //current lpow
                        range_high: 0.0001, //current lgov
                        info: "SPK generation rate for delegated LARYNX Power",
                        val: 0.00015,
                        step: 1,
                        unit: "",
                        title: "SPK Gen Rate: Delegated"
                    },
                    {
                        id: "spk_rate_lgov",
                        range_low: 0.00015, //current ldel
                        range_high: 0.01,
                        info: "SPK generation rate for Larynx Locked",
                        val: 0.001,
                        step: 0.000001,
                        unit: "",
                        title: "SPK Gen Rate: Locked"
                    },
                    {
                        id: "spk_rate_lpow",
                        range_low: 0.000001,
                        range_high: 0.00015, //current ldel
                        info: "SPK generation rate for undelegated Larynx Power",
                        val: 0.0001,
                        step: 0.000001,
                        unit: "",
                        title: "Min SPK Gen Rate: Min"
                    },
                    {
                        id: "max_coll_members",
                        range_low: 25,
                        range_high: 79,
                        info: "The Max number of accounts that can share DEX fees. The richer half of this group controls outflows from the multisig wallet.",
                        val: 25,
                        step: 1,
                        unit: "Accounts",
                        title: "Size of collateral group"
                    }
                ]
            },
            contract: {
                api: '',
                id: '',
                files: '',
                fosig: '', //file-owner
                spsig: '', //service-provider 
                s: 10485760,
                t: 0
            }
        };
    },
    emits: ['tosign', 'addasset', 'bens', 'done'],
    methods: {
        getdelimed(string, del = ',', index = 0) {
            return string.split(del)[index] ? string.split(del)[index] : ''
        },
        smartThumb(contract, index,cid) {
            var thumb = this.newMeta[contract][index * 4 + 3] || ''
            if (thumb.includes('Qm')) return `https://ipfs.dlux.io/ipfs/${thumb}`
            if (thumb.includes('https')) return thumb
            switch (this.newMeta[contract][index * 4 + 2]) {
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'gif':
                case 'bmp':
                case 'webp':
                case 'tiff':
                case 'tif':
                    return `https://ipfs.dlux.io/ipfs/${cid}`
                case 'svg':
                    return `svg`
                case 'mp4':
                case 'gltf':
                case 'glb':
                case 'html':
                case 'htm':
                case 'pdf':
                case 'txt':
                case 'md':
                case 'json':
                case 'csv':
                case 'xml':
                case 'yaml':
                case 'yml':
                case 'js':
                case 'css':
                case 'scss':
                case 'sass':
                case 'mp3':
                case 'wav':
                case 'ico':
                case 'enc': //encrypted
                default:
                    return '/img/dluxdefault.png'
            }
        },
        update_meta(contract) {
            console.log(this.newMeta[contract], contract)
            var meta = this.newMeta[contract]
            var cja = {
                id: contract,
                m: meta.join(',')
            };
            this.toSign = {
                type: "cja",
                cj: cja,
                id: `spkcc_update_metadata`,
                msg: `Updating Metadata for Contract: ${contract}`,
                ops: ["getSapi"],
                api: this.sapi,
                txid: `spkcc_update_meta`,
            };
        },
        done() {
            this.$emit('done')
        },
        modalSelect(url) {
            this.$emit('modalselect', url);
        },
        updatePubkey() {
            var cja = {
                pubKey: this.accountinfo.posting.key_auths[0][0]
            };
            this.toSign = {
                type: "cja",
                cj: cja,
                id: `spkcc_register_authority`,
                msg: `Registering: ${this.account}:${this.accountinfo.posting.key_auths[0][0]}`,
                ops: ["getSapi"],
                api: this.sapi,
                txid: `spkcc_register_authority`,
            };
        },
        addAssets(id, contract) {
            if (typeof id == 'object') this.$emit('addasset', id);
            else this.$emit('addasset', { id, contract });
        },
        sortContracts(on = 'c', dir = 'asc') {
            this.contracts.sort((a, b) => {
                if (a[on] > b[on]) {
                    return dir == 'asc' ? 1 : -1
                } else if (a[on] < b[on]) {
                    return dir == 'asc' ? -1 : 1
                } else {
                    return 0
                }
            })
            for (var i = 0; i < this.contracts.length; i++) {
                this.contracts[i].index = i
                this.contractIDs[this.contracts[i].i].index = i
            }
        },
        exp_to_time(exp = '0:0') {
            return this.when([parseInt(exp.split(':')[0])])
        },
        replace(string = "", char = ':') {
            return string.replaceAll(char, '_')
        },
        split(string, del, index) {
            return string.split(del)[index]
        },
        slotDecode(slot, index) {
            var item = slot.split(',')
            switch (index) {
                case 1:
                    return parseFloat(item[1] / 100).toFixed(2)
                    break;
                default:
                    return item[0]
                    break;
            } index
        },
        getSapi(user = this.account) {
            fetch(this.sapi + "/@" + user)
                .then((response) => response.json())
                .then((data) => {
                    data.tick = data.tick || 0.01;
                    this.larynxbehind = data.behind;
                    this.lbalance = (data.balance / 1000).toFixed(3);
                    this.lbargov = (data.gov / 1000).toFixed(3);
                    data.powerDowns = Object.keys(data.power_downs);
                    for (var i = 0; i < data.powerDowns.length; i++) {
                        data.powerDowns[i] = data.powerDowns[i].split(":")[0];
                    }
                    // Storage nodes won't get contracts from here, we'll need some props from the contract
                    if (!this.nodeview) {
                        for (var node in data.file_contracts) {
                            if (!data.file_contracts[node].m) {
                                data.file_contracts[node].m = ""
                                const filesNum = data.file_contracts[node]?.df ? Object.keys(data.file_contracts[node].df).length : 0
                                this.newMeta[data.file_contracts[node].i] = new Array(filesNum * 4 + 1).fill('')
                            } else {
                                this.newMeta[data.file_contracts[node].i] = data.file_contracts[node].m.split(",")
                            }
                            this.links[data.file_contracts[node].i] = ""
                            var links = "", j = 0
                            for(var i = 1; i < this.newMeta[data.file_contracts[node].i].length; i+=4){
                                links += `![${this.newMeta[data.file_contracts[node].i][i]}](https://ipfs.dlux.io/ipfs/${data.file_contracts[node]?.df[j]})\n`
                                j++
                            }
                            this.links[data.file_contracts[node].i] = links
                            this.contractIDs[data.file_contracts[node].i] = data.file_contracts[node];
                            this.contracts.push(data.file_contracts[node]);
                            this.contractIDs[data.file_contracts[node].i].index = this.contracts.length - 1;
                            
                        }
                        for (var user in data.channels) {
                            for (var node in data.channels[user]) {
                                if (this.contractIDs[data.channels[user][node].i]) continue
                                else {
                                    this.contractIDs[data.channels[user][node].i] = data.channels[user][node];
                                    this.contracts.push(data.channels[user][node]);
                                    this.contractIDs[data.channels[user][node].i].index = this.contracts.length - 1;
                                }
                            }
                        }
                        this.sortContracts()
                    }
                    this.saccountapi = data;
                    this.saccountapi.spk += this.reward_spk();
                    if (!this.saccountapi.granted.t) this.saccountapi.granted.t = 0;
                    if (!this.saccountapi.granting.t) this.saccountapi.granting.t = 0;
                    this.spkval =
                        (data.balance +
                            data.gov +
                            data.poweredUp +
                            this.saccountapi.granting.t +
                            data.claim +
                            data.spk) /
                        1000;
                });
        },
        getSpkStats() {
            fetch(this.sapi + "/stats")
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data);
                    this.loaded = true;
                    this.spkStats = data.result;
                    for (var i = 0; i < this.tokenGov.options.length; i++) {
                        this.tokenGov.options[i].val = data.result[this.tokenGov.options[i].id]
                        this.tokenGov.options[i].range_high = parseFloat(this.tokenGov.options[i].val * 1.01).toFixed(6)
                        this.tokenGov.options[i].range_low = parseFloat(this.tokenGov.options[i].val * 0.99).toFixed(6)
                        this.tokenGov.options[i].step = "0.000001"
                    }
                    this.getSapi()
                });
        },
        when(arr) {
            if (!arr.length) return "";
            var seconds =
                (parseInt(arr[0]) - parseInt(this.saccountapi.head_block)) * 3;
            var interval = Math.floor(seconds / 86400);
            if (interval >= 1) {
                return interval + ` day${interval > 1 ? "s" : ""}`;
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + ` hour${interval > 1 ? "s" : ""}`;
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return `${interval} minute${interval > 1 ? "s" : ""}`;
            }
            return Math.floor(seconds) + " seconds";
        },
        reward_spk() {
            var r = 0,
                a = 0,
                b = 0,
                c = 0,
                t = 0,
                diff = (this.saccountapi.head_block ? this.saccountapi.head_block : this.sstats.lastIBlock) - this.saccountapi.spk_block;
            //console.log(diff, this.saccountapi.head_block , this.sstats)
            if (!this.saccountapi.spk_block) {
                //console.log("No SPK seconds");
                return 0;
            } else if (diff < 28800) {
                //console.log("Wait for SPK");
                return 0;
            } else {
                t = parseInt(diff / 28800);
                a = this.saccountapi.gov
                    ? simpleInterest(this.saccountapi.gov, t, this.sstats.spk_rate_lgov)
                    : 0;
                b = this.saccountapi.pow
                    ? simpleInterest(this.saccountapi.pow, t, this.sstats.spk_rate_lpow)
                    : 0;
                c = simpleInterest(
                    parseInt(
                        this.saccountapi.granted?.t > 0 ? this.saccountapi.granted.t : 0
                    ) +
                    parseInt(
                        this.saccountapi.granting?.t > 0 ? this.saccountapi.granting.t : 0
                    ),
                    t,
                    this.sstats.spk_rate_ldel
                );
                const i = a + b + c;
                if (i) { return i } else { return 0 }
            }
            function simpleInterest(p, t, r) {
                const amount = p * (1 + parseFloat(r) / 365);
                const interest = amount - p;
                return parseInt(interest * t);
            }
        },
        selectContract(id, broker) {  //needs PeerID of broker
            this.contract.id = id
            fetch(`${this.sapi}/user_services/${broker}`)
                .then(r => r.json())
                .then(res => {
                    this.contract.api = res.services.IPFS[Object.keys(res.services.IPFS)[0]].a
                })
        },
        extend(contract, amount) {
            if (amount > this.broca_calc(this.broca)) return
            const toSign = {
                type: "cja",
                cj: {
                    broca: amount,
                    id: contract.i,
                    file_owner: contract.t,
                    power: this.spread ? 1 : 0,
                },
                id: `spkcc_extend`,
                msg: `Extending ${contract.i}...`,
                ops: ["getTokenUser"],
                api: "https://spktest.dlux.io",
                txid: "extend",
            }
            this.$emit('tosign', toSign)
        },
        store(contract, remove = false) {
            // have a storage node?
            const toSign = {
                type: "cja",
                cj: {
                    items: [contract]
                },
                id: `spkcc_${!remove ? 'store' : 'remove'}`,
                msg: `Storing ${contract}...`,
                ops: ["getTokenUser"],
                api: "https://spktest.dlux.io",
                txid: `${contract}_${!remove ? 'store' : 'remove'}`,
            }
            this.$emit('tosign', toSign)
        },
        getContracts() {
            var contracts = [],
                getContract = (id) => {
                    fetch('https://spktest.dlux.io/api/fileContract/' + id)
                        .then((r) => r.json())
                        .then((res) => {
                            res.result.extend = "7"
                            if (res.result) {
                                this.contracts[id] = res.result
                                if (res.result.c == 2) {
                                    this.state2contracts.push(res.result.s)
                                }
                                //this.extendcost[id] = parseInt(res.result.extend / 30 * res.result.r)
                            }
                        });
                }
            for (var contract in this.post.contract) {
                contracts.push(contract)
            }
            contracts = [...new Set(contracts)]
            for (var i = 0; i < contracts.length; i++) {
                getContract(contracts[i])
            }
        },
        addBen(s) {
            console.log(s)
            this.$emit('bens', { account: s.split(',')[0], weight: s.split(',')[1] })
        },
        getIPFSproviders() {
            fetch("https://spktest.dlux.io/services/IPFS")
                .then((response) => response.json())
                .then((data) => {
                    this.ipfsProviders = data.providers
                });
        },
        imgUrlAlt(event) {
            event.target.src = "/img/dlux-logo-icon.png";
        },
        picFind(json) {
            var arr;
            try {
                arr = json.image[0];
            } catch (e) { }
            if (typeof json.image == "string") {
                return json.image;
            } else if (typeof arr == "string") {
                return arr;
            } else if (typeof json.Hash360 == "string") {
                return `https://ipfs.dlux.io/ipfs/${json.Hash360}`;
            } else {
                /*
                        var looker
                        try {
                            looker = body.split('![')[1]
                            looker = looker.split('(')[1]
                            looker = looker.split(')')[0]
                        } catch (e) {
                            */
                return "/img/dluxdefault.png";
            }
        },
        pending(event) {
            this.mde = event
        },
        vote(url) {
            this.$emit('vote', { url: `/@${this.post.author}/${this.post.permlink}`, slider: this.slider, flag: this.flag })
        },
        color_code(name) {
            return parseInt(this.contracts[name] ? this.contracts[name].e.split(':')[0] : 0) - this.head_block
        },
        timeSince(date) {
            var seconds = Math.floor((new Date() - new Date(date + ".000Z")) / 1000);
            var interval = Math.floor(seconds / 86400);
            if (interval > 7) {
                return new Date(date).toLocaleDateString();
            }
            if (interval >= 1) {
                return interval + ` day${interval > 1 ? "s" : ""} ago`;
            }
            interval = Math.floor(seconds / 3600);
            if (interval >= 1) {
                return interval + ` hour${interval > 1 ? "s" : ""} ago`;
            }
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
                return `${interval} minute${interval > 1 ? "s" : ""} ago`;
            }
            return Math.floor(seconds) + " seconds ago";
        },
        setReply(event) {
            this.mde = event
        },
        reply(deets) {
            if (!deets) deets = {
                "parent_author": this.post.author,
                "parent_permlink": this.post.permlink,
                "author": this.account,
                "permlink": 're-' + this.post.permlink,
                "title": '',
                "body": this.mde,
                "json_metadata": JSON.stringify(this.postCustom_json)
            }
            this.$emit('reply', deets)
        },
        broca_calc(last = '0,0') {
            if (!last) last = '0,0'
            const last_calc = this.Base64toNumber(last.split(',')[1])
            const accured = parseInt((parseFloat(this.saccountapi.broca_refill || 144000) * (this.saccountapi.head_block - last_calc)) / (this.saccountapi.spk_power * 1000))
            var total = parseInt(last.split(',')[0]) + accured
            if (total > (this.saccountapi.spk_power * 1000)) total = (this.saccountapi.spk_power * 1000)
            return total
        },
        Base64toNumber(chars) {
            const glyphs =
                "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=";
            var result = 0;
            chars = chars.split("");
            for (var e = 0; e < chars.length; e++) {
                result = result * 64 + glyphs.indexOf(chars[e]);
            }
            return result;
        },
        formatNumber(t = 1, n, r, e) { // number, decimals, decimal separator, thousands separator
            if (typeof t != "number") {
                const parts = t ? t.split(" ") : []
                var maybe = 0
                for (i = 0; i < parts.length; i++) {
                    if (parseFloat(parts[i]) > 0) {
                        maybe += parseFloat(parts[i])
                    }
                }
                if (maybe > parseFloat(t)) {
                    t = maybe
                } else {
                    t = parseFloat(t)
                }
            }
            if (isNaN(t)) return "0";
            if (!isFinite(t)) return (t < 0 ? "-" : "") + "infinite";
            (r = r || "."), (e = e || "");
            var u = t < 0;
            t = Math.abs(t);
            var a = (null != n && 0 <= n ? t.toFixed(n) : t.toString()).split("."),
                i = a[0],
                o = 1 < a.length ? r + a[1] : "";
            if (e)
                for (var c = /(\d+)(\d{3})/; c.test(i);)
                    i = i.replace(c, "$1" + e + "$2");
            return (u ? "-" : "") + i + o;
        },
        gt(a, b) {
            return parseFloat(a) > parseFloat(b);
        },
        precision(num, precision) {
            return parseFloat(num / Math.pow(10, precision)).toFixed(precision);
        },
        toFixed(n, digits) {
            return parseFloat(n).toFixed(digits)
        },
        hideLowRep() {
            if (this.post.rep != '...') {
                if (parseFloat(this.post.rep) < 25) {
                    this.view = false;
                    this.warn = true;
                }
            } else {
                setTimeout(this.hideLowRep, 1000)
            }
        },
        setRating(rating) {
            this.post.rating = rating;
        },
        fancyBytes(bytes) {
            var counter = 0, p = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
            while (bytes > 1024) {
                bytes = bytes / 1024
                counter++
            }
            return `${this.toFixed(bytes, 2)} ${p[counter]}B`
        },
        expIn(con) {
            return `Expires in ${parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60) < 24 ? parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60) + ' hours' : parseInt((parseInt(con.e.split(':')[0]) - this.head_block) / 20 / 60 / 24) + ' days'}`
        },
        cancel_contract(contract) {
            //if(this.account != contract.t)return
            const toSign = {
                type: "cja",
                cj: {
                    id: contract.i,
                },
                id: `spkcc_contract_close`,
                msg: `Canceling ${contract.i}...`,
                ops: ["getTokenUser", "getSapi"],
                api: "https://spktest.dlux.io",
                txid: "cancel_contract",
            }
            this.$emit('tosign', toSign)
        }
    },
    watch: {
        'account'(newValue) {
            if (this.loaded == true) {
                if (!this.nodeview) {
                    this.contracts = []
                    this.contractIDs = {}
                }
                this.saccountapi = {
                    spk: 0,
                    balance: 0,
                    gov: 0,
                    poweredUp: 0,
                    claim: 0,
                    granted: {
                        t: 0
                    },
                    granting: {
                        t: 0
                    }
                },
                    this.getSpkStats()
            }
        },
        'toSign'(newValue) {
            if (newValue.type) {
                this.$emit('tosign', this.toSign)
                this.toSign = {}
            }
        },
        'prop_contracts'(newValue) {
            if (this.nodeview) {
                this.contracts = []
                this.contractIDs = {}
                const getContract = (id) => {
                    fetch('https://spktest.dlux.io/api/fileContract/' + id)
                        .then((r) => r.json())
                        .then((res) => {
                            res.result.extend = "7"
                            if (res.result) {
                                this.contracts.splice(this.contractIDs[id].index, 1, res.result)
                                //this.extendcost[id] = parseInt(res.result.extend / 30 * res.result.r)
                            }
                        });
                }
                var i = 0
                for (var node in this.prop_contracts) {
                    this.contracts.push(this.prop_contracts[node]);
                    this.contractIDs[this.prop_contracts[node].i] = this.prop_contracts[node];
                    this.contractIDs[this.prop_contracts[node].i].index = i
                    i++
                    getContract(this.prop_contracts[node].i)
                }
            }
        }
    },
    computed: {
        hasFiles() {
            return Object.keys(this.files).length > 0;
        }
    },
    mounted() {
        this.getSpkStats()
        this.getIPFSproviders()
        if (this.nodeview) {
            for (var node in this.prop_contracts) {
                this.contracts.push(this.prop_contracts[node]);
                this.contractIDs[this.prop_contracts[node].i] = this.prop_contracts[node];
                this.contractIDs[this.prop_contracts[node].i].index = this.prop_contracts.length - 1;
            }
        }
    },
};

