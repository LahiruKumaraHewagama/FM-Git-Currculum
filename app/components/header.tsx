"use client";
import React from 'react';
import {
    useUser,
    UserButton,
    SignInButton,
    SignUpButton
} from '@clerk/nextjs'
import Link from 'next/link';

const Header: React.FC = () => {
    const { isSignedIn, user } = useUser();

    return (
        <header className="header pl-10">
            <div className="grid grid-cols-1 sm:grid-cols-12">
                <div className="col-span-2">
                    <img src="/head_logo.png" alt="Logo" className="w-24 sm:h-auto" />
                </div>
                <div className="col-span-10 pt-5 ">
                    {isSignedIn && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-12">
                                <div className="col-span-9"></div>
                                <div className="col-span-2">
                                    {user?.publicMetadata.role === "admin" ? (
                                        <>
                                            <Link href="/dashboard" style={{ color: "green", paddingLeft: "50px" }}>Home</Link>
                                            <Link href="/manage" style={{ color: "green", paddingLeft: "50px" }}>Manage</Link>
                                        </>
                                    ) : (
                                        <Link href="/dashboard" style={{ color: "green", paddingLeft: "100px" }}>Home</Link>
                                    )}
                                </div>
                                <div className="col-span-1 pl-5"><UserButton /></div>
                            </div>
                        </>
                    )}
                    {!isSignedIn && (
                        <div className="grid grid-cols-1 sm:grid-cols-12 pt-0">
                            <div className="col-span-10"></div>
                                <div className="col-span-1">
                                    <button className="bg-transparent hover:bg-green-600 text-green-dark font-semibold hover:text-white py-1 px-4 border border-green-700 hover:border-transparent rounded"><SignInButton /></button>
                                </div>
                                <div className="col-span-1">
                                    <button className="bg-transparent hover:bg-green-600 text-green-dark font-semibold hover:text-white py-1 px-4 border border-green-700 hover:border-transparent rounded"><SignUpButton /></button>
                                </div>
                            </div>
                    )}
                        </div>
            </div>
        </header>
    );
};

export default Header;
