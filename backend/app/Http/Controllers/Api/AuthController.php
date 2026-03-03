<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
// Importamos la fachada de Hash que ya tienes, ¡genial!

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']) 
        ]);
        
        $token = $user->createToken('AuthTokenRegister')->plainTextToken;

        return (new UserResource($user))
            ->additional([
                'access_token' => $token, // Agregamos el token a la respuesta
                'token_type' => 'Bearer',
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401); 
        }
        
        $user = Auth::user(); 
        
        $user->tokens()->delete();

        $token = $user->createToken('AuthTokenLogin')->plainTextToken;

        return (new UserResource($user))
            ->additional([
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
    }

    public function user(Request $request)
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully (API Token removed)',
        ]);
    }
}