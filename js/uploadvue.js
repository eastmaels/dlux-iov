export default {
    template: `
    <!--file uploader-->
    <Transition>
        <div v-if="contract.i">
            <div>
                <form onsubmit="return false;">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="ms-auto me-auto my-3">
                            <label for="formFile" class="btn btn-lg btn-light"><i
                                    class="fa-solid fa-file-circle-plus fa-fw me-2"></i>Select Files</label>
                            <input class="d-none" id="formFile" type="file" multiple @change="uploadFile">
                        </div>
                    </div>
                    <div class="pb-2">
                        <div class="mx-lg-5 py-5 text-center lead rounded"
                            style="border-width: 2px; border-style: dashed; background-color:rgba(0,0,0,0.3);"
                            id="img-well" @drop="dragFile($event)" @dragenter.prevent @dragover.prevent>
                            Or drag file(s) here
                        </div>
                    </div>
                </form>
                <!-- encryption banner -->
                <div class="alert alert-danger d-flex align-items-center mx-lg-5">
                    
                    <div class="d-flex flex-column flex-grow-1 mx-1">
                        <div class="d-flex justify-content-around flex-wrap fs-3 fw-lighter border-bottom border-light border-1 mb-2">
                            <span class="me-auto">PRIVACY:</span>
                            <span v-if="!encryption.encrypted" class="me-auto fw-bold">PUBLIC<i class="ms-2 fa-solid fa-fw fa-lock-open"></i></span>
                            <span v-if="encryption.encrypted" class="me-auto fw-bold">PRIVATE<i class="ms-2 fa-solid fa-fw fa-lock"></i></span>
                        </div>
                        <div class="form-check form-switch d-flex align-content-center ps-0 mb-2">
                            <label class="form-check-label me-auto mb-0" for="encryptCheck">ENCRYPT FILES</label>
                            <input class="form-check-input fs-2 ms-auto mt-0" type="checkbox" role="switch" id="encryptCheck" v-model="encryption.encrypted"> 
                        </div>
                        <div v-if="!encryption.encrypted" class="mb-2">Files uploaded to this contract will not be encrypted, <b>they will be publicly available on SPK Network</b></div>
                        <div v-if="encryption.encrypted" class="mb-2">Files uploaded to this contract will be encrypted, <b>only the following accounts will have access.</b></div>
                        <!-- encrypted sharing -->
                        <div v-if="encryption.encrypted">
                            <div class="fs-3 fw-lighter">Sharing:</div>
                            <p>You can share the decryption key with a few other accounts to view the files</p>
                            
                            <div class="d-flex mb-2">
                                <div class="me-1 flex-grow-1">
                                    <div class="position-relative has-validation">
                                        <input autocapitalize="off" placeholder="username" class="form-control border-light bg-darkg text-info" v-model="encryption.input" @blur="addUser()">
                                    </div>
                                </div>
                                <div class="ms-1">
                                    <div class="btn btn-lg btn-success" @click="addUser()"><i class="fa-solid fa-fw fa-plus"></i></div>
                                </div>
                            </div>
                            
                            <!-- shared accounts -->
                            <div class="d-flex flex-row flex-wrap" v-for="(a,b,c) in encryption.accounts">
                                <div class="rounded text-black filter-bubble me-1 mb-1 d-flex align-items-center" :class="{'bg-success': encryption.accounts[b].enc_key, 'bg-warning': !encryption.accounts[b].enc_key}"> <!-- warning class for unencrypted keys --> 
                                    <span>{{b}}</span> 
                                    <button type="button" class="ms-1 btn-close btn-close-white" @click="delUser(b)"></button>
                                </div>
                            </div>

                            <!-- update button -->
                            <div class="d-flex mt-3">
                                <div v-if="unkeyed" @click="checkHive()" class="mx-auto btn btn-sm btn-success"><i class="fa-regular fa-fw fa-floppy-disk me-2"></i>Encrypt Keys</div>
                            </div>
                            
                        </div>
                    </div>
                    
                </div>
                <div v-if="File.length">
                    <div class=" pt-0">
                        <div id="listOfImgs" v-for="(file, index) in File">
                            <div class="p-3 mb-2 bg-darkest" style="border-radius: 10px;">
                                <div class="d-flex flex-wrap align-items-center pb-2 mb-2">
                                  <div>
                                    <h6 class="m-0 text-break">{{file.name}}</h6>
                                  </div>
                                    <div class="flex-grow-1 mx-5" v-if="file.actions.cancel">
                                        <div class="progress" role="progressbar" aria-label="Upload progress"
                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                            <div class="progress-bar" :style="'width: ' + file.progress + '%'">
                                                {{file.progress}}%
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex-shrink" v-if="File.length">
                                        <button type="button" class="me-2 btn btn-secondary" v-if="file.actions.pause"
                                            @click="fileRequest[index].resumeFileUpload()">Pause</button>
                                        <button type="button" class="me-2 btn btn-secondary" v-if="file.actions.resume"
                                            @click="fileRequest[index].resumeFileUpload()">Resume</button>
                                        <button type="button" class="me-2 btn btn-secondary" v-if="file.actions.cancel"
                                            @click="fileRequest[index].resumeFileUpload()">Cancel</button>
                                    </div>
                                    <div class="ms-auto">
                                        <button class="btn btn-danger" @click="deleteImg(index, file.name)"
                                            data-toggle="tooltip" data-placement="top" title="Delete Asset"><i
                                                class="fas fa-fw fa-trash-alt"></i></button>
                                    </div>
                                </div>
                                <div class="d-flex w-100" v-if="FileInfo[file.name]">
                                    <ul class="text-start w-100">
                                        <li class="">Bytes: {{file.size}}</li>
                                        <li class="">CID:
                                            {{FileInfo[file.name].hash}}</li>
                                        <li class="">Status:
                                            {{FileInfo[file.name].status}}
                                        </li>
                                        <li class=""><a :href="'https://ipfs.dlux.io/ipfs/' + FileInfo[file.name].hash"
                                                target="_blank">{{FileInfo[file.name].hash}}<i
                                                    class="fa-solid fa-up-right-from-square fa-fw ms-1"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex">
                        <button type="button" class="ms-auto me-auto mt-2 btn btn-lg btn-info" :class="{'disabled': !ready}" :disabled="!ready" @click="signNUpload()"><i
                                class="fa-solid fa-file-signature fa-fw me-2"></i>Sign and Upload</button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
   `,
props: {
    user: {
        type: Object,
        default: function () {
            return {}
        }
    },
    propcontract: {
        type: Object,
        default: function () {
            return {
                id: '',
                api: ''
            }
        }
    },
},
data() {
    return {
        files: {},
        fetching: false,
        contract: {
            id: '',
            api: ''
        },
        encryption: {
          input: '',
          key: '',
          encrypted: false,
          accounts: {},
        },
        fileRequests: {},
        FileInfo: {},
        File: [],
        ready: false,
        deletable: true,
    };
},
emits: ["tosign", "done"],
methods: {
  addUser(){
    if(this.encryption.input){
      this.encryption.accounts[this.encryption.input] = {
        key: '',
        enc_key: '',
      }
      this.encryption.input = ''
    }
  },
  delUser(user){
    delete this.encryption.accounts[user]
  },
  checkHive(){
    return new Promise((resolve, reject) => {
      this.fetching = true
      var accounts = Object.keys(this.encryption.accounts)
      var newAccounts = []
      for (var i = 0; i < accounts.length; i++) {
        if(!this.encryption.accounts[accounts[i]]?.key){
          newAccounts.push(accounts[i])
        }
      }
        
      if(newAccounts.length)fetch('https://hive-api.dlux.io', {
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
          if(data.result){
              for (var i = 0; i < data.result.length; i++) {
                  if(data.result[i].id){
                    this.encryption.accounts[data.result[i].name].key = data.result[i].memo_key
                  }
              }
              this.encryptKeyToUsers()
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
    encryptKeyToUsers(usernames) {
      return new Promise((resolve, reject) => {
        if(!usernames) usernames = Object.keys(this.encryption.accounts)
        var keys = []
        var dict = {}
        for (var i = 0; i < usernames.length; i++) {
          if(!this.encryption.accounts[usernames[i]].enc_key)keys.push(this.encryption.accounts[usernames[i]].key)
          dict[this.encryption.accounts[usernames[i]].key] = usernames[i]
        }
        const key = "#" + this.encryption.key;
        if(keys.length)hive_keychain.requestEncodeWithKeys(this.user.name, keys, key, 'Memo', (response) => {
            if (response.success) {
                for (var node in response.result){
                  this.encryption.accounts[dict[node]].enc_key = response.result[node]
                }
                resolve("OK")
            } else {
                reject(response.message);
            }
        });
        else resolve (null)
      })
    },
    decryptMessage(username = this.user.name , encryptedMessage) {
      return new Promise((resolve, reject) => {
        let encryptedKey = encryptedMessage.split("#")[1];
        let encryptedMessageOnly = encryptedMessage.split("#")[2];
        console.log("Encrypted message: ", encryptedMessageOnly);
        hive_keychain.requestVerifyKey(username, '#'+encryptedKey, 'Memo', (response) => {
            if (response.success) {
                let key = response.result;
                this.encryption.key = key
                resolve(key)
            } else {
                reject(response.message);
            }
        });
      })
    },
    sha256Encrypt(message, key) {
      return CryptoJS.AES.encrypt(message, key).toString();
    },
    sha256Decrypt(encryptedMessage, key) {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
    uploadFile(e) {
        for (var i = 0; i < e.target.files.length; i++) {
          var reader = new FileReader();
          reader.File = e.target.files[i]
          reader.onload = (Event) => {
            const event = Event
            const target = event.currentTarget ? event.currentTarget : event.target
            const fileContent = target.result;
            for (var i = 0; i < this.File.length; i++) {
              if (
                this.File[i].name == target.File.name
                && this.File[i].size == target.File.size
              ) {
                Hash.of(buffer.Buffer(fileContent), { unixfs: 'UnixFS' }).then((hash) => {
                  const dict = { fileContent: new TextDecoder("utf-8").decode(fileContent), hash, index: i, size: target.File.size, name: target.File.name, path: e.target.id, progress: 0, status: 'Pending Signature' }
                  fetch(`https://spktest.dlux.io/api/file/${hash}`).then(r => r.json()).then(res => {
                    if(res.result == "Not found"){
                      this.FileInfo[dict.name] = dict
                      const file = this.File[i];
                      this.File.splice(i, 1, file);
                    } else {
                      alert(`${target.File.name} already uploaded`)
                      delete this.FileInfo[dict.name]
                      this.File.splice(i, 1)
                    }
                  })
                });
                break
              }
            }
          };
  
          reader.readAsArrayBuffer(e.target.files[i])
          var File = e.target.files[i];
          File.hash = "computing..."
          File.progress = 0;
          File.actions = {
            cancel: false,
            pause: false,
            resume: false,
          }
          this.File.push(File);
        }
        this.ready = true
      },
    dragFile(e) {
        e.preventDefault();
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          var reader = new FileReader();
          reader.File = e.dataTransfer.files[i]
          reader.onload = (Event) => {
            const event = Event
            const target = event.currentTarget ? event.currentTarget : event.target
            const fileContent = event.target.result;
            // for (var i = 0; i < this.File.length; i++) {
            //   if (
            //     this.File[i].name == target.File.name
            //     && this.File[i].size == target.File.size
            //   ) {
            Hash.of(buffer.Buffer(fileContent)).then(hash => {
              const dict = { fileContent: new TextDecoder("utf-8").decode(fileContent), hash, index: i, size: target.File.size, name: target.File.name, path: e.target.id, progress: 0, status: 'Pending Signature' }
                  fetch(`https://spktest.dlux.io/api/file/${hash}`).then(r => r.json()).then(res => {
                    if(res.result == "Not found"){
                      this.FileInfo[dict.name] = dict
                      const file = this.File[i];
                      this.File.splice(i, 1, file);
                    } else {
                      alert(`${target.File.name} already uploaded`)
                      delete this.FileInfo[dict.name]
                      this.File.splice(i, 1)
                    }
                  })
              // var File = e.dataTransfer.files[i];
            })
          };
          
          reader.readAsArrayBuffer(e.dataTransfer.files[i]);
          var File = e.dataTransfer.files[i]
          File.hash = "computing..."
          File.progress = 0;
          File.actions = {
            cancel: false,
            pause: false,
            resume: false,
          }
          this.File.push(File);
        }
        this.ready = true
      },
    deleteImg(index, name) {
        delete this.FileInfo[name]
        for (var item in this.FileInfo) {
          if (this.FileInfo[item].index > index) {
            this.FileInfo[item].index--
          }
        }
        this.File.splice(index, 1)
      },
      signNUpload() {
        console.log(this.contract.i)
        var header = `${this.contract.i}`
        var body = ""
        var names = Object.keys(this.FileInfo)
        var cids = []
        for (var i = 0; i < names.length; i++) {
          body += `,${this.FileInfo[names[i]].hash}`
          cids.push(this.FileInfo[names[i]].hash)
        }
        this.contract.files = body
        this.signText(header + body).then(res => {
          console.log({ res })
          this.contract.fosig = res.split(":")[3]
          this.upload(cids, this.contract)
          this.ready = false
        })
      },
      signText(challenge) {
        return new Promise((res, rej) => {
          this.toSign = {
            type: "sign_headers",
            challenge,
            key: "posting",
            ops: [],
            callbacks: [res, rej],
            txid: "Sign Auth Headers",
          };
          this.$emit("tosign", this.toSign);
        });
      },
      selectContract(id, broker) {  //needs PeerID of broker
        this.contract.id = id
        fetch(`https://spktest.dlux.io/user_services/${broker}`)
          .then(r => r.json())
          .then(res => {
            console.log(res)
            this.contract.api = res.services.IPFS[Object.keys(res.services.IPFS)[0]].a
          })
      },
      upload(cids = ['QmYJ2QP58rXFLGDUnBzfPSybDy3BnKNsDXh6swQyH7qim3'], contract ) { // = { api: 'https://ipfs.dlux.io', id: '1668913215284', sigs: {}, s: 10485760, t: 0 }) {
        var files = []
        var meta = ','
        for (var name in this.FileInfo) {
          for (var i = 0; i < cids.length; i++) {
            if (this.FileInfo[name].hash == cids[i]) {
              this.File[this.FileInfo[name].index].cid = cids[i]
              files.push(this.File[this.FileInfo[name].index])
              //get everything before the last .
              var Filename = name.split('.').slice(0, -1).join('')
              //get everything after the last
              var ext = name.split('.').slice(-1).join('')
              meta += `${Filename},${ext},,`
              break;
            }
          }
        }
        console.log({ cids }, files, meta)
        const ENDPOINTS = {
          UPLOAD: `${this.contract.api}/upload`,
          UPLOAD_STATUS: `${this.contract.api}/upload-check`,
          UPLOAD_REQUEST: `${this.contract.api}/upload-authorize`
        };
        const defaultOptions = {
          url: ENDPOINTS.UPLOAD,
          startingByte: 0,
          contract: contract,
          cid: null,
          cids: `${cids.join(',')}`,
          meta,
          onAbort: (e, f) => {
            console.log('options.onAbort')
            // const fileObj = files.get(file);
            this.File = []
            this.FileInfo = {}
            this.fileRequests = {}
            // updateFileElement(fileObj);
          },
          onProgress: (e, f) => {
            console.log('options.onProgress', e, f, this.FileInfo, this.File, this.File[this.FileInfo[f.name].index])
            this.File[this.FileInfo[f.name].index].actions.pause = true
            this.File[this.FileInfo[f.name].index].actions.resume = false
            this.File[this.FileInfo[f.name].index].actions.cancel = true
            this.File[this.FileInfo[f.name].index].progress = e.loaded / e.total * 100
            // const fileObj = files.get(file);
            this.FileInfo[f.name].status = `uploading(${this.File[this.FileInfo[f.name].index].progress}%)`
            // fileObj.status = FILE_STATUS.UPLOADING;
            // fileObj.percentage = e.percentage;
            // fileObj.uploadedChunkSize = e.loaded;
  
            // updateFileElement(fileObj);
          },
          onError: (e, f) => {
            console.log('options.onError', e, f)
            // const fileObj = files.get(file);
            this.FileInfo[e.name].status = '!!ERROR!!'
            // fileObj.status = FILE_STATUS.FAILED;
            // fileObj.percentage = 100;
            this.File[this.FileInfo[e.name].index].actions.pause = false
            this.File[this.FileInfo[e.name].index].actions.resume = true
            this.File[this.FileInfo[e.name].index].actions.cancel = true
            // updateFileElement(fileObj);
          },
          onComplete: (e, f) => {
            console.log('options.onComplete', e, f)
            this.File[this.FileInfo[f.name].index].actions.pause = false
            this.File[this.FileInfo[f.name].index].actions.resume = false
            this.File[this.FileInfo[f.name].index].actions.cancel = false
            this.FileInfo[f.name].progress = 100
            this.File[this.FileInfo[f.name].index].progress = 100
            this.FileInfo[f.name].status = 'done'
            var done = true
            for(var file in this.FileInfo){
              if(this.FileInfo[file].status != 'done'){
                done = false
                break;
              }
            }
            if(done){
              setTimeout(() => {
                this.$emit('done', this.contract)
              }, 5000)
            }
          }
        };
        const uploadFileChunks = (file, options) => {
          const formData = new FormData();
          const req = new XMLHttpRequest();
          const chunk = file.slice(options.startingByte);
  
          formData.append('chunk', chunk);
          console.log(options)
          req.open('POST', options.url, true);
          req.setRequestHeader(
            'Content-Range', `bytes=${options.startingByte}-${options.startingByte + chunk.size}/${file.size}`
          );
          req.setRequestHeader('X-Cid', options.cid);
          req.setRequestHeader('X-Contract', options.contract.i);
          req.setRequestHeader('X-Sig', options.contract.fosig);
          req.setRequestHeader('X-Account', options.contract.t);
          req.setRequestHeader('X-Files', options.cids);
          req.setRequestHeader('X-Meta', options.meta);
  
  
          req.onload = (e) => {
            if (req.status === 200) {
              options.onComplete(e, file);
            } else {
              options.onError(e, file);
            }
          };
  
          req.upload.onprogress = (e) => {
            const loaded = options.startingByte + e.loaded;
            options.onProgress({
              ...e,
              loaded,
              total: file.size,
              percentage: loaded / file.size * 100
            }, file);
          };
  
          req.ontimeout = (e) => options.onError(e, file);
  
          req.onabort = (e) => options.onAbort(e, file);
  
          req.onerror = (e) => options.onError(e, file);
  
          this.fileRequests[options.cid].request = req;
  
          req.send(formData);
        };
        const uploadFile = (file, options, cid) => {
          console.log('Uploading', cid, options, file)
          return fetch(ENDPOINTS.UPLOAD_REQUEST, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Sig': options.contract.fosig,
              'X-Account': options.contract.t,
              'X-Contract': options.contract.i,
              'X-Cid': cid,
              'X-Files': options.contract.files,
              'X-Meta': options.meta,
              'X-Chain': 'HIVE'
            }
          })
            .then(res => res.json())
            .then(res => {
              console.log('Chunking', options, file)
              options = { ...options, ...res };
              options.cid = cid
              this.fileRequests[cid] = { request: null, options }
              uploadFileChunks(file, options);
            })
            .catch(e => {
              console.log(e)
              options.onError({ ...e, file })
            })
        };
        const abortFileUpload = (file) => {
          const fileReq = fileRequests.get(file);
  
          if (fileReq && fileReq.request) {
            fileReq.request.abort();
            return true;
          }
  
          return false;
        };
        const retryFileUpload = (file) => {
          const fileReq = fileRequests.get(file);
  
          if (fileReq) {
            // try to get the status just in case it failed mid upload
            return fetch(
              `${ENDPOINTS.UPLOAD_STATUS}?fileName=${file.name}&fileId=${fileReq.options.fileId}`)
              .then(res => res.json())
              .then(res => {
                // if uploaded we continue
                uploadFileChunks(
                  file,
                  {
                    ...fileReq.options,
                    startingByte: Number(res.totalChunkUploaded)
                  }
                );
              })
              .catch(() => {
                // if never uploaded we start
                uploadFileChunks(file, fileReq.options)
              })
          }
        };
        const clearFileUpload = (file) => {
          const fileReq = fileRequests.get(file);
  
          if (fileReq) {
            abortFileUpload(file)
            fileRequests.delete(file);
  
            return true;
          }
  
          return false;
        };
        const resumeFileUpload = (file) => {
          const fileReq = this.fileRequests[cid];
  
          if (fileReq) {
            return fetch(
              `${ENDPOINTS.UPLOAD_STATUS}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'sig': contract.fosig,
                'account': contract.t,
                'contract': contract.i,
                'cid': cid
              }
            })
              .then(res => res.json())
              .then(res => {
                uploadFileChunks(
                  file,
                  {
                    ...fileReq.options,
                    startingByte: Number(res.totalChunkUploaded)
                  }
                );
              })
              .catch(e => {
                fileReq.options.onError({ ...e, file })
              })
          }
        };
        [...files]
          .forEach(file => {
            let options = defaultOptions
            options.cid = file.cid
            uploadFile(file, options, file.cid)
          });
      },
      appendFile(file, id) {
        if (this.files[file]) delete this.files[file]
        else this.files[file] = id
      },
      uploadAndTrack(name, contract) {
        this.signText().then((headers) => {
          let uploader = null;
          const setFileElement = (file) => {
            // create file element here
          }
          const onProgress = (e, file) => { };
          const onError = (e, file) => { };
          const onAbort = (e, file) => { };
          const onComplete = (e, file) => { };
          return (uploadedFiles) => {
            [...uploadedFiles].forEach(setFileElement);
  
            //append progress box
            uploader = uploadFiles(uploadedFiles, {
              onProgress,
              onError,
              onAbort,
              onComplete
            });
          }
        });
      },
},
computed: {
    hasFiles() {
        return Object.keys(this.files).length > 0;
    },
    unkeyed() {
      var accounts = Object.keys(this.encryption.accounts)
      for (var i = 0; i < accounts.length; i++) {
        if(!this.encryption.accounts[accounts[i]].enc_key)return true
      }
      return false
    }
},
mounted() {
    this.contract = this.propcontract;
    this.selectContract(this.contract.i, this.contract.b)
    this.encryption.key = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    this.encryption.accounts[this.user.name] = {
      key: '',
      enc_key: '',
    }
},
};