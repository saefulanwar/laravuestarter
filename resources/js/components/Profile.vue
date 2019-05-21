<style>
.widget-user-header {
    background-position: center center;
    background-size: cover;
    height: 250px !important;
}
</style>

<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card card-widget widget-user">
                    <div class="widget-user-header text-white" style="background-image:url('./img/user-cover.jpg')">
                    <h3 class="widget-user-username">{{this.form.name}}</h3>
                    <h5 class="widget-user-desc">{{this.form.bio}}</h5>
                    </div>
                    <div class="widget-user-image">
                    <img class="img-circle" :src="getProfilePhoto()" alt="User Avatar">
                    </div>
                    <div class="box-footer">
                    <div class="row">
                        <div class="col-sm-4 border-right">
                        <!-- <div class="description-block">
                            <h5 class="description-header">3,200</h5>
                            <span class="description-text">SALES</span>
                        </div> -->
                        <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-4 border-right">
                        <!-- <div class="description-block">
                            <h5 class="description-header">13,000</h5>
                            <span class="description-text">FOLLOWERS</span>
                        </div> -->
                        <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                        <div class="col-sm-4">
                        <!-- <div class="description-block">
                            <h5 class="description-header">35</h5>
                            <span class="description-text">PRODUCTS</span>
                        </div> -->
                        <!-- /.description-block -->
                        </div>
                        <!-- /.col -->
                    </div>
                    <!-- /.row -->
                    </div>
                </div>
            </div>

            <!--tab-->
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header p-2">
                        <ul class="nav nav-pills">
                            <li class="nav-item"><a href="#settings" class="nav-link active show" data-toggle="tab">Profile</a></li>
                            <li class="nav-item"><a href="#activity" class="nav-link" data-toggle="tab">Anything</a></li>
                        </ul>
                    </div> <!--card-header-->
                    
                    <div class="card-body">
                        <div class="tab-content">
                    <!-- Activity Tab -->
                            <div class="tab-pane" id="activity">
                                <h3 class="text-center">Display Anything Content</h3>
                            </div>
                    <!--setting tab-->
                        <div class="tab-pane active show" id="settings">
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="inputName" class="col-sm-2 control-label">Name</label>

                                        <div class="col-sm-12">
                                        <input type="text" 
                                            v-model="form.name" 
                                            name="name"
                                            class="form-control" 
                                            id="inputName" 
                                            placeholder="Name"
                                            :class="{ 'is-invalid': form.errors.has('name') }">
                                            <has-error :form="form" field="name"></has-error>
                                        </div>
                                    </div>
                                     <div class="form-group">
                                        <label for="inputEmail" 
                                            class="col-sm-2 control-label">Email</label>

                                        <div class="col-sm-12">
                                        <input type="email" 
                                            v-model="form.email" 
                                            name="email"
                                            class="form-control" 
                                            id="inputEmail" 
                                            placeholder="Email"
                                            :class="{ 'is-invalid': form.errors.has('email') }">
                                            <has-error :form="form" field="email"></has-error>
                                        </div>
                                    </div>
                                     <div class="form-group">
                                        <label for="inputExperience" class="col-sm-2 control-label">Experience</label>

                                        <div class="col-sm-12">
                                        <textarea name="bio" v-model="form.bio" id="inputExperience" class="form-control" placeholder="Experience"></textarea>                                    
                                        </div>
                                    </div>

                                     <div class="form-group">
                                        <label for="password" class="col-sm-4 control-label">Password (leave empty if not changing)</label>

                                        <div class="col-sm-12">
                                        <input type="password" 
                                            v-model="form.password" 
                                            name="password"
                                            class="form-control" 
                                            id="inputPassword" 
                                            placeholder="Password"
                                            :class="{ 'is-invalid': form.errors.has('password') }">                        
                                           <has-error :form="form" field="password"></has-error>
                                        </div>
                                     </div>

                                     <div class="form-group">
                                        <label for="photo" class="col-sm-4 control-label">Profil Photo</label>

                                        <div class="col-sm-12">
                                        <input type="file" @change="updateProfile" name="photo" class="form-input">
                                        </div>
                                     </div>


                                    <div class="form-group">
                                    <div class="col-sm-offset-2 col-sm-12">
                                    <button @click.prevent="updateInfo" type="submit" class="btn btn-success">Update</button>
                                    </div>
                                    </div>
                                </form>
                        </div>
                        </div>
                        </div>
                        <!-- /.tab-pane -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
        },
        data() {
            return {
                    form: new Form({
                        id: '',
                        name: '',
                        email:'',
                        password: '',
                        type:'',
                        bio:'',
                        photo:''
                })
            }
        },
        methods: {
            getProfilePhoto(){
                let photo = (this.form.photo.length > 180) ? this.form.photo :  "img/profile/"+this.form.photo;

                return photo;
                // return "img/profile/"+this.form.photo
            },
            updateInfo() {
                this.$Progress.start();
                this.form.put('api/profile')
                .then( () => {
                
                this.$Progress.finish();
                })
                .catch( () => {
                this.$Progress.fail();
                });
            },
            updateProfile(e) {
                let file = e.target.files[0];
                console.log(file);
                
                let reader = new FileReader();

                if(file['size'] < 2111775){
                    reader.onloadend = (file) => {
                    this.form.photo = reader.result;
                    }
                    reader.readAsDataURL(file);
                }else{
                    swal.fire({
                        type:'error',
                        title: 'Oops..',
                        text:'You are uploading a large file'
                    })
                }
            }
        },
        created() {
            axios.get('api/profile').then( ( {data} ) => this.form.fill(data));
        }
    }
</script>
