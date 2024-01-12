import { Request, Response } from "express";

import { db } from "../utils/db.server";

export const createUser = async ({
    firstName,
    lastName,
    username,
    email,
}: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}) => {
    try {
        const result = await db.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                displayName: username,
                email: email,
                bio: "",
                connectedToSpotify: false,
                connectedToApple: false,
            },
        });
        return result;
    } catch (error) {
        console.log(`Error with creating a user: ${error}`);
        return null;
    }
};

export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const result = await db.user.findFirst({ where: { id } });
        console.log(result);
        return res.status(200).send(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(`Error getting user data`);
    }
};

export const findOrCreateUser = async ({
    firstName,
    lastName,
    username,
    email,
}: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}) => {
    try {
        const existingUser = await db.user.findUnique({
            where: {
                email: email,
            },
        });

        if (existingUser) {
            return existingUser;
        } else {
            const newUser = await createUser({
                firstName,
                lastName,
                username,
                email,
            });
            return newUser;
        }
    } catch (error) {
        console.log(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;
    try {
        await db.user.update({ where: { id }, data: { ...data } });
        return res.status(200).send("Successfully updated user");
    } catch (error) {
        return res.status(500).send("Error updating user");
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        await db.user.delete({ where: { id } });
        return res.status(200).send("Successfully deleted user");
    } catch (error) {
        return res.status(500).send(`Error deleting user: ${error}`);
    }
};
