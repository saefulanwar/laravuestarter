<template>
    <div class="container">
        <div class="row mt-5">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">User Role / Type</h3>

                        <div class="card-tools">
                            <button class="button btn-success" @click="newModal">Add New <i class="fas fa-user-plus fa-fw"></i></button>
                        </div>

                    </div>

                    <div class="card-body table-responsive p-0">
                        <table class="table table-hover">
                            <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>Role Name</th>
                                    <th>Label</th>
                                    <th>Description</th>
                                    <th>Modify</th>
                                </tr>
                                <tr v-for="role in roles.data" :key="role.id">
                                    <td>{{role.id}}</td>
                                    <td>{{role.name}}</td>
                                    <td>{{role.label}}</td>
                                    <td>{{role.description}}</td>
                                    <td>
                                        <a href="#" @click="editModal(role)">
                                            <i class="fa fa-edit blue"></i>
                                        </a>
                                        /
                                        <a href="#" @click="deleteRole(role.id)">
                                            <i class="fa fa-trash red"></i>
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer"></div>
                </div>
            </div>
        </div>
        <div v-if="!$gate.isAdminOrAuthor()">
            <not-found></not-found>
        </div>

        <!-- modal -->
        <div class="modal fade" id="addNew" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 v-show="!editmode" class="modal-title">Add New Role</h5>
                <h5 v-show="editmode" class="modal-title">Update Role</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form @submit.prevent="editmode ? editRole() : createRole()">
                <div class="modal-body">
                    <div class="form-group">
                    <label>Role Name</label>
                    <input v-model="form.name" type="text" name="name"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                    <has-error :form="form" field="name"></has-error>
                    </div>
                    <div class="form-group">
                    <label>Label Name</label>
                    <input v-model="form.label" type="text" name="label"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('label') }">
                    <has-error :form="form" field="label"></has-error>
                    </div>
                    <div class="form-group">
                    <label>Description</label>
                    <input v-model="form.description" type="text" name="description"
                        class="form-control" :class="{ 'is-invalid': form.errors.has('description') }">
                    <has-error :form="form" field="description"></has-error>
                    </div>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button v-show="editmode" type="submit" class="btn btn-success">Update</button>
                    <button v-show="!editmode" type="submit" class="btn btn-primary">Create</button>

                </div>
            </form>

            </div>
        </div>
        </div>
        <!-- end modal -->

    </div>
</template>

<script>
    export default {
        data () {
        return {
            editmode: false,
            roles: {},
            form: new Form({
                id: '',
                name: '',
                label: '',
                description:'',
                type:''
            })
            }
        },
        methods:{
            deleteRole(id){
                swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                if (result.value) {
                    this.form.delete('api/role/'+id)
                    .then(() => {
                        Fire.$emit('LoadRole');

                        swal.fire(
                        'Deleted!',
                        'Your role data has been deleted.',
                        'success'
                        )
                    })
                    .catch(() => {
                        swal.fire("Failed", "There was something wrong","warning")
                    });
                }
                })
                // console.log('delete');
            },
            editRole(){
                this.$Progress.start();

                this.form.put('api/role/'+this.form.id)
                .then(()=>{
                    $('#addNew').modal('hide');

                    Fire.$emit('LoadRole');
                    
                    swal.fire(
                        'Updated',
                        'Your role has been updated',
                        'success'
                    )
                    this.$Progress.finish();
                })
                .catch(()=>{
                    swal.fire(
                        'Failed',
                        'There was something wrong',
                        'warning'
                        )
                    this.$Progress.fail();
                })
                $this.$Progress.finish();
                // console.log('edit');
            },
            editModal(role){
                this.editmode = true;
                this.form.reset();

                $('#addNew').modal('show');
                this.form.fill(role);
            },
            loadRole(){
                if(this.$gate.isAdminOrAuthor()){
                    axios.get('api/role').then(({data}) => (this.roles = data));
                }
            },
            createRole(){
                this.$Progress.start();

                this.form.post('api/role')
                .then( () => {
                    Fire.$emit('LoadRole');

                    $('#addNew').modal('hide');

                    toast.fire({
                        type: 'success',
                        title: 'New Role Created successfully'
                    })
                })
                .catch( () => {
                    this.$Progress.fail();
                })

                this.$Progress.finish();
            },
            newModal(){
                $('#addNew').modal('show');
            }
        },
        created() {
            Fire.$on('searching',() => {
                let query = this.$parent.search;
                axios.get('api/findRole?q=' + query)
                .then( (data) => {
                    this.roles = data.data;
                })
                .catch( () => {

                })
            });

            this.loadRole();

            Fire.$on('LoadRole', () => {
                this.loadRole();
            });
        },
        mounted() {
            console.log('Component mounted.')
        }
    }
</script>
