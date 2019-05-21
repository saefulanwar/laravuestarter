<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Role;
use Gate;

class RoleController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Gate::allows('isAdmin') || Gate::allows('isAuthor')){
            return Role::latest()->paginate(10);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:40|unique:roles',
            'label' => 'required|string|max:40|unique:roles',
        ]);

        return Role::create([
            'name' => $request['name'],
            'label' => $request['label'],
            'description' => $request['description']
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $this->validate($request,[
            'name' => 'required|max:40|unique:roles,name,'.$role->id,
            'label' => 'required|max:40|unique:roles,label,'.$role->id
        ]);

        $role->update($request->all());

        return ['message' => 'Update role success'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        $role->delete();

        return ['message' => 'Role was deleted'];
    }

    public function search(){
        if($search = \Request::get('q')){
            $roles = Role::where(function($query) use ($search){
                $query->where('name','LIKE',"%$search%")
                       ->orWhere('label','LIKE',"%$search%")
                       ->orWhere('description','LIKE',"%$search%");
            })->paginate(10);
        }else{
            $roles = Role::latest()->paginate(10); 
        }
        return $roles; 
    }
}
