import Pop from "/js/pop-min.js";
import ExtensionVue from "/js/extensionvue.js";
import FilesVue from "/js/filesvue.js";
import UploadVue from "/js/uploadvue.js";
import ModalVue from "/js/modalvue.js";
import PostVue from "/js/postvue.js";
import ChoicesVue from '/js/choices-vue.js';


export default {
    components: {
        "pop-vue": Pop,
        "extension-vue": ExtensionVue,
        "files-vue": FilesVue,
        "upload-vue": UploadVue,
        "modal-vue": ModalVue,
        "post-vue": PostVue,
        "choices-vue": ChoicesVue
    },
    template: `
    <div class="d-flex justify-content-center mt-2">
    <!-- register account -->
    <div v-if="saccountapi.pubKey == 'NA'" class="d-flex">
        <div class="d-flex justify-content-center p-3">
            <div class="text-center" style="max-width: 600px;">
                <p class="lead">Click Register Account to join the SPK Network and store your files on IPFS</p>
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
                    
                        <files-vue :assets="assets" @addassets="addAssets($event)"
                            :contracts="contracts"></files-vue>
                   
                </div>
            </div>
            
            <!-- contracts -->
            <div role="tabpanel" class="tab-pane show active" id="contractsTab" aria-labelledby="contractstab">
                <!-- top menu -->
                <div class="pb-1 mb-2 border-bottom border-2 border-light">
                    <div class="mx-1 mx-lg-3 d-flex flex-wrap justify-content-center align-items-center">
                        <h2 class="my-1 fw-light text-start">{{title}}</h2>
                        <div class="d-flex flex-wrap flex-grow-1 ms-2">
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
                                                                        {{contract.c > 1 ? fancyBytes(contract.u) : fancyBytes(contract.a)}}
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
                                                            <td class="border-0 px-0 px-md-1" colspan="4">
                                                                <div class="d-flex flex-column border border-white rounded text-start py-2" style="background-color:rgba(0,0,0,0.3);">

                                                                    <!-- contract ID -->
                                                                    <div class="d-flex justify-content-center small text-white-50 mb-3">
                                                                        <div class="text-center"> Contract ID <i class="fa-solid fa-file-contract fa-fw mx-1" aria-hidden="true"></i><span class="text-break">{{contract.i}}</span>
                                                                        </div>
                                                                    </div>
                                                               

                                                                    <!-- upload time banner -->
                                                                    <div v-if="contract.c == 1" class="mx-1 mb-3">
                                                                        <div class="alert alert-warning d-flex align-items-center mx-lg-5">
                                                                            <div class="d-flex flex-grow-1 flex-wrap me-1 align-items-center">
                                                                                <div class="mx-1">
                                                                                    <div class="fs-3 fw-lighter">You have {{exp_to_time(contract.e)}} to start this contract</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="ms-auto d-flex flex-wrap align-items-center fs-1 text-warning justify-content-center me-2 mx-1">
                                                                                <i class="fa-solid fa-bell fa-fw ms-2"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- post time banner -->
                                                                    <div v-if="contract.c == 2" class="mx-1 mx-lg-5 mb-3">
                                                                        <div class="alert alert-warning d-flex align-items-center ">
                                                                            <div class="d-flex flex-grow-1 flex-wrap me-1 align-items-center">
                                                                                <div class="mx-1">
                                                                                    <div class="fs-3 fw-lighter">You have {{exp_to_time(contract.e)}} to publish this contract</div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="ms-auto d-flex flex-wrap align-items-center fs-1 text-warning justify-content-center me-2 mx-1">
                                                                                <i class="fa-solid fa-bell fa-fw ms-2"></i>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    

                                                                    <!-- post -->
                                                                    <div v-if="account == contract.t && !postpage && contract.c == 2" class="mb-3 mx-1 mx-lg-5 p-sm-1 p-lg-2 rounded" style="background-color:rgba(0,0,0,0.3)">
                                                                        <div class="d-flex flex-column">
                                                                            <div>
                                                                                <div class="mx-auto ms-md-1 mt-2 lead fs-2">Post Details</div>
                                                                            </div>
                                                                            <div class="bg-dark px-1 py-2 p-lg-3 mt-2 rounded">
                                                                                <post-vue :account="account"
                                                                                :prop_bens="[contract.s]"
                                                                                :prop_uid="contract.i"
                                                                                :prop_links="links[contract.i]"
                                                                                :prop_insert="postBodyAdder[contract.i]"
                                                                                @tosign="toSign=$event" />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- upload -->
                                                                    <div v-if="contract.c == 1" class="mx-1">
                                                                        <upload-vue :user="saccountapi" :propcontract="contract" @tosign="toSign=$event" @done="done()" />
                                                                    </div>


                                                                    <!-- extension -->
                                                                    <div v-if="contract.c == 3" class="mx-1 d-flex flex-grow-1">
                                                                        <div class="align-items-center mx-lg-5 d-flex flex-grow-1 mb-3 gradient-border bg-dark">
                                                                            
                                                                                <extension-vue :node-view="nodeview"
                                                                                :contract="contract" :sstats="sstats"
                                                                                :account="account" :saccountapi="saccountapi" :spkapi="spkapi"
                                                                                @tosign="toSign=$event"></extension-vue>
                                                                            
                                                                        </div>
                                                                    </div>

                                                                    
                                                                    <!-- files list -->
                                                                    <div v-if="contract.df">
                                                                        <div class="mb-3 mx-1 mx-lg-5 p-sm-1 p-lg-2 rounded" style="background-color:rgba(0,0,0,0.3)">
                                                                            <div class="d-flex flex-column">
                                                                                <div>
                                                                                    <div class="mx-auto ms-md-1 mt-2 lead fs-2">{{pluralFiles(contract.i)}} File{{pluralFiles(contract.i) > 1 ? 's' : ''}}</div>
                                                                                </div>
                                                                                
                                                                                
                                                                                <div class="mt-2 rounded bg-dark p-2" v-for="(size, cid, index) in contract.df">

                                                                                        <div class="row align-items-center"> 

                                                                                            <div class="col-md-4">
                                                                                                <div class="d-flex flex-column justify-content-center">

                                                                                                    
                                                                                                    <!--<img class="mx-auto img-fluid rounded bg-light" :src="smartThumb(contract.i,index,cid)" width="314px" onerror="if (this.src != '/img/other-file-type-svgrepo-com.svg') this.src = '/img/other-file-type-svgrepo-com.svg'"> -->
                                                                                                    <div class="bg-light rounded">    
                                                                                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                                                                                viewBox="0 0 800 800" style="enable-background:new 0 0 800 800;" xml:space="preserve" >
                                                                                                            
                                                                                                            <g >
                                                                                                                <path class="st0" d="M650,210H500c-5.5,0-10-4.5-10-10V50c0-5.5,4.5-10,10-10s10,4.5,10,10v140h140c5.5,0,10,4.5,10,10
                                                                                                                    S655.5,210,650,210z"/>
                                                                                                                <path class="st0" d="M650,309.7c-5.5,0-10-4.5-10-10v-95.5L495.9,60H200c-22.1,0-40,17.9-40,40v196.3c0,5.5-4.5,10-10,10
                                                                                                                    s-10-4.5-10-10V100c0-33.1,26.9-60,60-60h300c2.7,0,5.2,1,7.1,2.9l150,150c1.9,1.9,2.9,4.4,2.9,7.1v99.7
                                                                                                                    C660,305.2,655.5,309.7,650,309.7z"/>
                                                                                                                <path class="st0" d="M600,760H200c-33.1,0-60-26.9-60-60V550c0-5.5,4.5-10,10-10s10,4.5,10,10v150c0,22.1,17.9,40,40,40h400
                                                                                                                    c22.1,0,40-17.9,40-40V550c0-5.5,4.5-10,10-10s10,4.5,10,10v150C660,733.1,633.1,760,600,760z"/>
                                                                                                                <path class="st0" d="M550,560H250c-5.5,0-10-4.5-10-10s4.5-10,10-10h300c5.5,0,10,4.5,10,10S555.5,560,550,560z"/>
                                                                                                                <path class="st0" d="M400,660H250c-5.5,0-10-4.5-10-10s4.5-10,10-10h150c5.5,0,10,4.5,10,10S405.5,660,400,660z"/>
                                                                                                                <path class="st0" d="M650,560H150c-33.1,0-60-26.9-60-60l0,0V346.3c0-33.1,26.9-60,60-60l0,0h0.4l500,3.3
                                                                                                                    c32.9,0.3,59.5,27.1,59.6,60V500C710,533.1,683.2,560,650,560C650,560,650,560,650,560z M150,306.3c-22.1,0-40,17.9-40,40V500
                                                                                                                    c0,22.1,17.9,40,40,40h500c22.1,0,40-17.9,40-40V349.7c-0.1-22-17.8-39.8-39.8-40l-500-3.3H150z"/>
                                                                                                                <text transform="matrix(1 0 0 1 233.3494 471.9725)" class="st1 st2" style="text-transform: uppercase; font-size: 149px;">{{newMeta[contract.i][index * 4 + 2]}}</text>
                                                                                                            </g>
                                                                                                        </svg>
                                                                                                    </div>

                                                                                                    <span class="small text-center mb-2">{{fancyBytes(size)}}</span>
                                                                                                    
                                                                                                    <!-- link -->
                                                                                                    <div v-if="!flagDecode(contract.m).enc">
                                                                                                        <a :href="'https://ipfs.dlux.io/ipfs/' + cid" target="_blank" class="w-100 btn btn-sm btn-primary mb-1 mx-auto"><span class="d-flex align-items-center">URL<i class="ms-auto fa-solid fa-fw fa-up-right-from-square"></i></span></a>
                                                                                                    </div>
                                                                                                    <!-- download  -->
                                                                                                    <div class="d-none" v-if="!flagDecode(contract.m).enc">
                                                                                                        <button type="button" class="w-100 btn btn-sm btn-primary mb-1 mx-auto" @click="downloadFile(cid, contract.i, index)"><span class="d-flex align-items-center w-100">Download<i class="fa-solid fa-download fa-fw ms-auto"></i></span></button>
                                                                                                    </div>
                                                                                                    <!-- decrypt  -->
                                                                                                    <div v-if="flagDecode(contract.m).enc && !contract.encryption.key">
                                                                                                        <button type="button" class="w-100 btn btn-sm btn-primary mb-1 mx-auto" @click="decryptKey(contract.i)"><span class="d-flex align-items-center w-100">Decrypt<i class="fa-solid fa-fw ms-auto fa-lock-open"></i></span></button>
                                                                                                    </div>
                                                                                                    <!-- download enc -->
                                                                                                    <div v-if="flagDecode(contract.m).enc && contract.encryption.key">
                                                                                                        <button type="button" class="w-100 btn btn-sm btn-primary mb-1 mx-auto" @click="downloadFile(cid, contract.i, index)"><span class="d-flex align-items-center w-100">Download<i class="fa-solid fa-download fa-fw ms-auto"></i></span></button>
                                                                                                    </div>
                                                                                                        <!-- add to post -->
                                                                                                    <div v-if="contract.c == 2">
                                                                                                        <button type="button" class="w-100 btn btn-sm btn-purp mb-1 mx-auto" @click="addToPost(cid, contract.i, index)"><span class="d-flex align-items-center w-100">Add to Post<i class="fa-solid fa-plus fa-fw ms-auto"></i></span></button>
                                                                                                    </div>

                                                                                                    

                                                                                                    
                                                                                                </div>
                                                                                            </div>

                                                                                            <div class="col-md-8"> 
                                                                        
                                                                                                <div class="mb-1">    
                                                                                                    <label class="mb-1">File Name</label>
                                                                                                    <div class="input-group">
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 1]" placeholder="File Name" pattern="[a-zA-Z0-9]{3,25}" class="form-control">
                                                                                                        <span class="input-group-text">.</span>
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 2]" placeholder="File Type" pattern="[a-zA-Z0-9]{1,4}" class="form-control">
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="mb-1">
                                                                                                    <label class="mb-1">Thumbnail</label>
                                                                                                    <div class="position-relative has-validation">
                                                                                                        <input autocapitalize="off" v-model="newMeta[contract.i][index * 4 + 3]" placeholder="https://your-thumbnail-image.png" pattern="https:\/\/[a-z0-9.-\/]+|Qm[a-zA-Z0-9]+" class="form-control">
                                                                                                    </div>
                                                                                                </div>

                                                                                                <!-- choices-js-->
                                                                                                <div class="mb-1">
                                                                                                    <label class="mb-1">Tags</label>
                                                                                                    <choices-vue ref="select-tag" :prop_selections="newMeta[contract.i][index * 4 + 4]" prop_type="tags" @data="handleTag(contract.i, index * 4 + 4, $event)"></choices-vue>
                                                                                                </div>
                                                                                                <div class="mb-1">
                                                                                                    <label class="mb-1">Labels</label>
                                                                                                    <choices-vue ref="select-label" :prop_selections="newMeta[contract.i][index * 4 + 4]" prop_type="labels" @data="handleLabel(contract.i, index * 4 + 4, $event)"></choices-vue>
                                                                                                </div> 
                                                                                                
                                                                                            </div>

                                                                                        </div>

                                                                                        
                                                                                
                                                                                    
                                                                                </div>

                                                                                <!-- encrypted sharing -->
                                                                                <div v-if="flagDecode(contract.m).enc" class="mt-3">
                                                                                    
                                                                                        <div class="d-flex flex-column flex-grow-1">
                                                                                            <div class="fs-3 fw-lighter">Sharing</div>
                                                                                            <p v-if="contract.t == spkapi.name">{{pluralFiles(contract.i) > 1 ? 'These files are' : 'This file is'}} encrypted. You can add and remove accounts that can decrypt {{pluralFiles(contract.i) > 1 ? 'them' : 'it'}}.</p>
                                                                                            <p v-if="contract.t != spkapi.name">{{pluralFiles(contract.i) > 1 ? 'These files are' : 'This file is'}} encrypted and shared with the following:</p>
                                                                                            
                                                                                            <!-- decrypt button -->
                                                                                            <div class="mb-2" v-if="contract.t == spkapi.name && !contract.encryption.key">
                                                                                                    <div class="w-100 btn btn-lg btn-dark" @click="decryptKey(contract.i)">Decrypt to Modify<i class="fa-solid fa-fw ms-2 fa-lock-open"></i></div>
                                                                                            </div>
                                                                                            
                                                                                            <!-- username input add -->
                                                                                            <div class="d-flex mb-2" v-if="contract.t == spkapi.name && contract.encryption.key">
                                                                                                <div class="me-1 flex-grow-1">
                                                                                                    <div class="position-relative has-validation">
                                                                                                        <input autocapitalize="off" placeholder="username" class="form-control border-light bg-darkg text-info" v-model="contract.encryption.input" @keyup.enter="addUser(contract.i)">
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div class="ms-1">
                                                                                                    <div class="btn btn-lg btn-light" @click="addUser(contract.i)"><i class="fa-solid fa-fw fa-plus"></i></div>
                                                                                                </div>
                                                                                            </div>
                                                                                            
                                                                                            <!-- shared accounts -->
                                                                                            <div class="d-flex flex-row flex-wrap mb-2">
                                                                                                <div v-for="(a,b,c) in contract.encryption.accounts">
                                                                                                    <div :class="{'bg-white' : contract.encryption.key && b != contract.t, 'bg-white-50' : !contract.encryption.key || b == contract.t}" class="rounded text-black filter-bubble me-1 mb-1 d-flex align-items-center">    
                                                                                                        <div class="d-flex align-items-center">
                                                                                                            <i class="fa-solid fa-key fa-fw me-1" :class="{'text-primary': contract.encryption.accounts[b].enc_key, 'text-warning': !contract.encryption.accounts[b].enc_key}"></i>
                                                                                                            <span>{{b}}</span>
                                                                                                            <div v-if="contract.t == spkapi.name && contract.encryption.key && b != contract.t"><button type="button" class="ms-2 btn-close small btn-close-white" @click="delUser(contract.i, b)"></button></div>
                                                                                                            <div v-if="b == spkapi.name && !contract.encryption.key"><button type="button" class="d-none ms-2 small btn-white" @click="decryptKey(contract.i)"><i class="fa-solid fa-fw mx-1 fa-lock-open" aria-hidden="true"></i></button></div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>

                                                                                                <!-- encrypt / save button -->
                                                                                            <div class="d-flex text-center">
                                                                                                <button v-if="unkeyed(contract.i)" class="mx-auto mb-2 btn btn-lg btn-outline-warning" type="button" @click="checkHive(contract.i)"><i class="fa-solid fa-fw fa-user-lock me-2"></i>Encrypt Keys</button>
                                                                                                <button v-if="metaMismatch(contract.i) && !unkeyed(contract.i)" class="btn btn-lg btn-outline-warning mx-auto mb-2" type="button" @click="update_meta(contract.i)"><i class="fa-solid fa-floppy-disk fa-fw me-2"></i>Save Changes</button>
                                                                                            </div>

                                                                                            
                                                                                            
                                                                                        </div>
                                                                                    
                                                                                </div>

                                                                                    <!-- save button -->
                                                                                <div class="d-flex text-center">
                                                                                    <button v-if="metaMismatch(contract.i) && !flagDecode(contract.m).enc" class="btn btn-lg btn-outline-warning mx-auto my-2" type="button" @click="update_meta(contract.i)"><i class="fa-solid fa-floppy-disk fa-fw me-2"></i>Save Changes</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>


                                                                    


                                                                   

                                                                    

                                                                    <!-- contract details -->
                                                                    <div class="d-flex flex-wrap justify-content-center my-3 small mx-lg-5">

                                                                        
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Owner </div>
                                                                            <i class="fa-solid fa-user fa-fw mx-1" aria-hidden="true"></i>
                                                                            <div><a :href="'/@' + contract.t" class="no-decoration text-primary">@{{contract.t}}</a></div>
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
                                                                            <div>{{contract.c > 1 ? fancyBytes(contract.u) : fancyBytes(contract.a)}}</div>
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
                                                                        <div class="d-flex align-items-center px-3 py-1 m-1 rounded-pill border border-white">
                                                                            <div> Privacy </div>
                                                                            <i class="fa-solid fa-fw mx-1" :class="{'fa-lock-open': !flagDecode(contract.m).enc, 'fa-lock': flagDecode(contract.m).enc}" aria-hidden="true"></i>
                                                                            <div>{{flagDecode(contract.m).enc ? 'Private' : 'Public'}}</div>
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
            postBodyAdder: {},
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
        addToPost(cid, contract, index, loc = 'self') {
            var string = this.smartThumb(contract, index, cid)
            if (string.includes('ipfs/')) {
                string = `![${this.newMeta[contract][index * 4 + 1]}](${string})`
            } else {
                string = `[${this.newMeta[contract][index * 4 + 1]}.${this.newMeta[contract][index * 4 + 2]}](https://ipfs.dlux.io/ipfs/${cid})`
            }
            this.postBodyAdder[`${loc == 'self' ? contract : loc}`] = string
        },
        addUser(id) {
            if (this.contractIDs[id].encryption) {
                this.contractIDs[id].encryption.accounts[this.contractIDs[id].encryption.input] = {
                    key: '',
                    enc_key: '',
                }
                this.contractIDs[id].encryption.input = ''
            }
        },
        delUser(id, user) {
            delete this.contractIDs[id].encryption.accounts[user]
        },
        checkHive(id) {
            return new Promise((resolve, reject) => {
                this.fetching = true
                var accounts = Object.keys(this.contractIDs[id].encryption.accounts)
                var newAccounts = []
                for (var i = 0; i < accounts.length; i++) {
                    if (!this.contractIDs[id].encryption.accounts[accounts[i]]?.key) {
                        newAccounts.push(accounts[i])
                    }
                }

                if (newAccounts.length) fetch('https://hive-api.dlux.io', {
                    method: 'POST',
                    body: JSON.stringify({
                        "jsonrpc": "2.0",
                        "method": "condenser_api.get_accounts",
                        "params": [newAccounts],
                        "id": 1
                    })
                }).then(response => response.json())
                    .then(data => {
                        this.fetching = false
                        if (data.result) {
                            for (var i = 0; i < data.result.length; i++) {
                                if (data.result[i].id) {
                                    this.contractIDs[id].encryption.accounts[data.result[i].name].key = data.result[i].memo_key
                                }
                            }
                            this.encryptKeyToUsers(id)
                            resolve(data.result)
                        } else {
                            reject(data.error)
                        }
                    })
                    .catch(e => {
                        this.fetching = false
                    })
            })
        },
        encryptKeyToUsers(id) {
            return new Promise((resolve, reject) => {
                const usernames = Object.keys(this.contractIDs[id].encryption.accounts)
                var keys = []
                var dict = {}
                for (var i = 0; i < usernames.length; i++) {
                    if (!this.contractIDs[id].encryption.accounts[usernames[i]].enc_key) keys.push(this.contractIDs[id].encryption.accounts[usernames[i]].key)
                    dict[this.contractIDs[id].encryption.accounts[usernames[i]].key] = usernames[i]
                }
                const key = "#" + this.contractIDs[id].encryption.key;
                if (keys.length) hive_keychain.requestEncodeWithKeys(this.account, keys, key, 'Memo', (response) => {
                    console.log(response)
                    if (response.success) {
                        for (var node in response.result) {
                            this.contractIDs[id].encryption.accounts[dict[node]].enc_key = response.result[node]
                        }
                        resolve("OK")
                    } else {
                        reject(response.message);
                    }
                });
                else resolve(null)
            })
        },
        decryptKey(id) {
            return new Promise((resolve, reject) => {
                const key = this.contractIDs[id].encryption.accounts[this.spkapi.name].enc_key;
                hive_keychain.requestVerifyKey(this.spkapi.name, key, 'Memo', (response) => {
                    if (response.success) {
                        this.contractIDs[id].encryption.key = response.result.split('#')[1]
                        resolve("OK")
                    } else {
                        reject(response.message);
                    }
                });
            })
        },
        AESDecrypt(encryptedMessage, key) {
            const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
            return bytes.toString(CryptoJS.enc.Utf8);
        },
        downloadFile(cid, id, index) {
            fetch(`https://ipfs.dlux.io/ipfs/${cid}`)
                .then((response) => response.text())
                .then((blob) => {
                    const name = this.newMeta[id][index * 4 + 1] + '.' + this.newMeta[id][index * 4 + 2] || 'file'
                    if (this.contractIDs[id].encryption.key) {
                        blob = this.AESDecrypt(blob, this.contractIDs[id].encryption.key);
                        blob = new Blob([blob]);
                    }
                    try {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = name;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    } catch (e) {
                        var url = window.URL.createObjectURL(response);
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = name;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    }

                });
        },
        smartThumb(contract, index, cid, force = false) {
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
                case 'svg':
                    return `https://ipfs.dlux.io/ipfs/${cid}`
                case 'mp4':
                case 'mov':
                    return `/img/mov-file-type-svgrepo-com.svg`
                case 'avi':
                    return `/img/avi-file-type-svgrepo-com.svg`
                case 'gltf':
                case 'glb':
                    return `/img/dluxdefault.png`
                case 'html':
                case 'htm':
                    return `/img/html-file-type-svgrepo-com.svg`
                case 'pdf':
                    return `/img/pdf-file-type-svgrepo-com.svg`
                case 'txt':
                case 'json':
                case 'md':
                case 'xml':
                case 'yaml':
                case 'yml':
                case 'js':
                    return `/img/txt-file-type-svgrepo-com.svg`
                case 'csv':
                    return `/img/csv-file-type-svgrepo-com.svg`
                case 'css':
                case 'scss':
                    return `/img/css-file-type-svgrepo-com.svg`
                case 'mp3':
                    return `/img/mp3-file-type-svgrepo-com.svg`
                case 'wav':
                    return `/img/wav-file-type-svgrepo-com.svg`
                case 'rar':
                    return `/img/rar-file-type-svgrepo-com.svg`
                case 'zip':
                    return `/img/zip-file-type-svgrepo-com.svg`
                case '':
                    return '/img/other-file-type-svgrepo-com.svg'
                case 'enc': //encrypted
                default:
                    return '/img/other-file-type-svgrepo-com.svg'
            }
        },
        flagDecode(flags = "") {
            if (flags.indexOf(',') > -1) flags = flags.split(',')[4]
            var num = this.Base64toNumber(flags[0])
            var out = {}
            if (num & 1) out.enc = true
            if (num & 2) out.autoRenew = true
            if (num & 4) out.nsfw = true
            if (num & 8) out.executable = true
            return out
        },
        metaMismatch(id) {
            var enc_string = ''
            for (var acc in this.contractIDs[id].encryption.accounts) {
                if (this.contractIDs[id].encryption.accounts[acc].enc_key) enc_string += `${this.contractIDs[id].encryption.accounts[acc].enc_key}@${acc};`
            }
            //remove last ;
            enc_string = enc_string.slice(0, -1)
            this.newMeta[id][0] = enc_string
            if (this.contractIDs[id].m != `${this.newMeta[id].join(',')}`) return true
        },
        update_meta(contract) {
            return new Promise((resolve, reject) => {
                console.log(this.newMeta[contract], contract)
                var enc_string = ''
                for (var acc in this.contractIDs[contract].encryption.accounts) {
                    if (this.contractIDs[contract].encryption.accounts[acc].enc_key) enc_string += `${this.contractIDs[contract].encryption.accounts[acc].enc_key}@${acc};`
                }
                //remove last ;
                enc_string = enc_string.slice(0, -1)
                this.newMeta[contract][0] = enc_string
                var meta = this.newMeta[contract]
                var cja = {
                    id: contract,
                    m: meta.join(',')
                };
                const removeSave = new Promise((res, rej) => {
                    this.toSign = {
                        type: "cja",
                        cj: cja,
                        id: `spkccT_update_metadata`,
                        msg: `Updating Metadata for Contract: ${contract}`,
                        ops: [],
                        callbacks: [res, rej],
                        api: this.sapi,
                        txid: `spkccT_update_meta`,
                    };
                })
                removeSave.then(() => {
                    this.contractIDs[contract].m = cja.m
                    console.log(this.contractIDs[contract].m, cja.m)
                    resolve('OK')
                }).catch(e => {
                    reject(e)
                })
            })
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
                id: `spkccT_register_authority`,
                msg: `Registering: ${this.account}:${this.accountinfo.posting.key_auths[0][0]}`,
                ops: ["getSapi"],
                api: this.sapi,
                txid: `spkccT_register_authority`,
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
        pluralFiles(id) {
            return parseInt(this.newMeta[id].length / 4)
        },
        getSapi(user = this.account) {
            if (user) fetch(this.sapi + "/@" + user)
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
                            data.file_contracts[node].encryption = {
                                input: "",
                                key: "",
                                accounts: {},
                            }
                            if (!data.file_contracts[node].m) {
                                data.file_contracts[node].m = ""
                                const filesNum = data.file_contracts[node]?.df ? Object.keys(data.file_contracts[node].df).length : 0
                                this.newMeta[data.file_contracts[node].i] = new Array(filesNum * 4 + 1).fill('')
                            } else {
                                const encData = data.file_contracts[node].m.split(',')[0] || ''
                                const encAccounts = encData.split(';')
                                for (var i = 0; i < encAccounts.length; i++) {
                                    const encA = encAccounts[i].split('@')[1]
                                    data.file_contracts[node].encryption.accounts[encA] = {
                                        enc_key: encAccounts[i].split('@')[0],
                                        key: '',
                                        done: true,
                                    }
                                }
                                this.newMeta[data.file_contracts[node].i] = data.file_contracts[node].m.split(",")
                            }
                            this.links[data.file_contracts[node].i] = ""
                            var links = "", j = 0
                            for (var i = 1; i < this.newMeta[data.file_contracts[node].i].length; i += 4) {
                                links += `![${this.newMeta[data.file_contracts[node].i][i]}](https://ipfs.dlux.io/ipfs/${data.file_contracts[node]?.df[j]})\n`
                                j++
                            }
                            this.links[data.file_contracts[node].i] = links
                            this.contractIDs[data.file_contracts[node].i] = data.file_contracts[node];

                            this.contracts.push(data.file_contracts[node]);
                            this.contractIDs[data.file_contracts[node].i].index = this.contracts.length - 1;
                            this.postBodyAdder[data.file_contracts[node].i] = ""

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
        handleLabel(id, i, m) {
            if (m.action == 'added') {
                var string = this.newMeta[id][i]
                if (!string) string = '2'
                this.newMeta[id][i] += m.item
            } else {
                console.log('remove', m.item)
                var string = this.newMeta[id][i]
                var arr = string.split('')
                for (var j = 1; j < arr.length; j++) {
                    if (arr[j] == m.item) arr.splice(j, 1)
                }
                this.newMeta[id][i] = arr.join('')
            }
        },
        handleTag(id, i, m) {
            var num = this.Base64toNumber(this.newMeta[id][i][0]) || 0
            if (m.action == 'added') {
                if (num & m.item) { }
                else num += m.item
                this.newMeta[id][i] = (this.NumberToBase64(num) || "0") + this.newMeta[id][i].slice(1)
            } else {
                if (num & m.item) num -= m.item
                this.newMeta[id][i] = (this.NumberToBase64(num) || "0") + this.newMeta[id][i].slice(1)
            }
        },
        NumberToBase64(num) {
            const glyphs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+=";
            var result = "";
            while (num > 0) {
                result = glyphs[num % 64] + result;
                num = Math.floor(num / 64);
            }
            return result;
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
                id: `spkccT_extend`,
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
                id: `spkccT_${!remove ? 'store' : 'remove'}`,
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
        Base64toNumber(chars = "") {
            if (typeof chars != 'string') {
                console.log({ chars })
                return 0
            }
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
        unkeyed(obj) {
            if (!obj) return false
            if (!this.contracts[this.contractIDs[obj].index].encryption) return false
            for (var node in this.contracts[this.contractIDs[obj].index].encryption.accounts) {
                if (!this.contracts[this.contractIDs[obj].index].encryption.accounts[node].enc_key) return true
            }
            return false
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
                id: `spkccT_contract_close`,
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

