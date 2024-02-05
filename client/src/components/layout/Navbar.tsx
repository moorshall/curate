import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearUser } from "@/redux/features/user/userSlice";
import PostModal from "../PostModal";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import AuthModal from "../AuthModal";

export default function Navbar() {
    const user = useSelector((state: RootState) => state.userReducer.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutWithRedirect = async () => {
        await dispatch(clearUser());
        navigate("/");
    };

    return (
        <div className="flex justify-center">
            <div className="space-x-1 flex flex-row items-center rounded-lg border py-1.5 px-1.5">
                <Button onClick={() => navigate("/")} variant="ghost">
                    Home
                </Button>
                <Button onClick={() => navigate("/discover")} variant="ghost">
                    Discover
                </Button>
                <Button onClick={() => navigate("/search")} variant="ghost">
                    Search
                </Button>
                {user ? (
                    <>
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger>
                                        {user.displayName}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <div className="flex flex-col items-start bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md space-y-1 p-2 min-w-[90px]">
                                            <Button
                                                onClick={() =>
                                                    navigate(
                                                        `/user/${user?.id}`
                                                    )
                                                }
                                                variant={"ghost"}
                                            >
                                                Profile
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    logoutWithRedirect();
                                                }}
                                                variant={"ghost"}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                        <PostModal>
                            <Button>
                                <IconPlus className="ml-[-4px] mr-2 h-4 w-4" />{" "}
                                Post
                            </Button>
                        </PostModal>
                    </>
                ) : (
                    <AuthModal>
                        <Button variant={"ghost"}>Login</Button>
                    </AuthModal>
                )}
            </div>
        </div>
    );
}
