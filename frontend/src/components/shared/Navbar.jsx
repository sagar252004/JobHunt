import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant.js';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`,null, { withCredentials: true });
            if (res.data.success) {  
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Logout failed!');
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="flex items-center justify-between mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16">
                {/* Logo */}
                <div className="flex items-center">
                   <a href="/"><h1 className="text-2xl font-bold">
                        Job<span className="text-[#F83002]">Portal</span>
                    </h1></a> 
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-12">
                    <ul className="flex font-medium items-center gap-6 text-gray-700">
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li>
                                    <Link to="/admin/companies" className="hover:text-[#F83002] transition-colors">
                                        Companies
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/jobs" className="hover:text-[#F83002] transition-colors">
                                        Jobs
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/" className="hover:text-[#6A38C2] transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/jobs" className="hover:text-[#6A38C2] transition-colors">
                                        Jobs
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/browse" className="hover:text-[#6A38C2] transition-colors">
                                        Browse
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Authentication Buttons */}
                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login">
                                <Button variant="outline" className="hover:border-[#6A38C2]">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer border hover:border-[#6A38C2] transition-all">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || '/default-avatar.png'}
                                        alt="User Profile"
                                    />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-white shadow-lg rounded-lg p-4 border">
                                <div>
                                    <div className="flex gap-3 items-center mb-4">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto || '/default-avatar.png'}
                                                alt="User Profile"
                                            />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium text-lg text-gray-800">{user?.fullname}</h4>
                                            <p className="text-sm text-gray-500">{user?.profile?.bio}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-gray-700">
                                        {user.role === 'student' && (
                                            <div className="flex items-center gap-2 cursor-pointer">
                                                <User2 className="text-gray-600" />
                                                <Button variant="link">
                                                    <Link to="/profile">View Profile</Link>
                                                </Button>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 cursor-pointer">
                                            <LogOut className="text-gray-600" />
                                            <Button onClick={logoutHandler} variant="link">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;