import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createFollow, deleteFollow } from "@/api/routes/follow";
import { RootState } from "@/redux/store";
import SettingsModal from "../SettingsModal";
import { Button } from "../ui/button";

export default function Header({
    user,
    setUser,
    isCurrentUser,
}: {
    user: User;
    setUser: (val: User) => void;
    isCurrentUser: boolean;
}) {
    const currentUser = useSelector(
        (state: RootState) => state.userReducer.user
    );
    const { enqueueSnackbar } = useSnackbar();

    const [isFollowing, setIsFollowing] = useState(true);

    useEffect(() => {
        setIsFollowing(
            user.followers?.some(
                (follower) =>
                    currentUser &&
                    follower.followerId === user.id &&
                    follower.followingId === currentUser.id
            ) || false
        );
    }, [user, currentUser]);

    const handleFollow = async () => {
        if (currentUser) {
            await createFollow({
                followerId: user.id,
                followingId: currentUser.id,
            });

            const newFollowers = [
                ...(user.followers || []),
                { followerId: user.id, followingId: currentUser.id },
            ];

            setUser({ ...user, followers: newFollowers });
            setIsFollowing(true);
        } else {
            enqueueSnackbar("You must be logged in to follow users.", {
                autoHideDuration: 2000,
            });
        }
    };

    const handleUnfollow = async () => {
        if (currentUser) {
            await deleteFollow({
                followerId: user.id,
                followingId: currentUser.id,
            });

            const newFollowers = user.followers?.filter((follower) => {
                return currentUser && follower.followingId !== currentUser.id;
            });

            setUser({ ...user, followers: newFollowers });
            setIsFollowing(false); // Set follow status to false
        }
    };

    return (
        <div className="flex flex-row rounded-xl drop-shadow-xl py-6 px-8 border border-border items-center justify-between">
            <div className="flex flex-row items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-primary"></div>
                <div className="flex flex-col space-y-2">
                    <h3>{user?.displayName}</h3>
                    <div className="flex flex-row">
                        {isCurrentUser ? (
                            <SettingsModal user={user}>
                                <Button>Settings</Button>
                            </SettingsModal>
                        ) : isFollowing ? (
                            <Button onClick={() => handleUnfollow()}>
                                Unfollow
                            </Button>
                        ) : (
                            <Button onClick={() => handleFollow()}>
                                Follow
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-row space-x-4">
                <div className="flex flex-col items-center">
                    <h3>{user.posts?.length || 0}</h3>
                    <p>Posts</p>
                </div>
                <div className="border-l" />
                <div className="flex flex-col items-center">
                    <h3>{user.saves?.length || 0}</h3>
                    <p>Saves</p>
                </div>
                <div className="border-l" />
                <div className="flex flex-col items-center">
                    <h3>{user.followers?.length || 0}</h3>
                    <p>Followers</p>
                </div>
                <div className="border-l" />
                <div className="flex flex-col items-center">
                    <h3>{user.following?.length || 0}</h3>
                    <p>Following</p>
                </div>
            </div>
        </div>
    );
}
