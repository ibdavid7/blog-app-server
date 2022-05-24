import {Post, Prisma} from "@prisma/client";
import {Context} from "../index";

interface postCreateUpdateArgs {
    post: {
        title?: string,
        content?: string,
    }
}

interface PostPayloadType {
    userErrors: {
        message: string,
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null,
}

export const Mutation = {
    postCreate: async (parent: any, args: postCreateUpdateArgs, {prismaClient}: Context
    ): Promise<PostPayloadType> => {

        const {title, content} = args.post;
        // validate title and content are not empty
        if (!title || !content) {
            return {
                userErrors: [
                    {message: "You must provide valid title and content to create a Post"}
                ],
                post: null,
            }
        }

        return {
            userErrors: [],
            post: prismaClient.post.create({
                data: {
                    title,
                    content,
                    authorId: 1,
                }
            }),
        }

    },
    postUpdate: async (
        parent: any,
        {postId, post}: { postId: string, post: postCreateUpdateArgs["post"] },
        context: Context
    ): Promise<PostPayloadType> => {

        const {title, content} = post;

        // validate title and content
        if (!title && !content) {
            return {
                userErrors: [{message: "Need to have title or content to update"}],
                post: null,
            }
        }
        const {prismaClient} = context;

        const existingPost = await prismaClient.post.findUnique({
            where: {
                id: Number(postId),
            }
        });

        // validate post exists
        if (!existingPost) {
            return {
                userErrors: [{message: "Post does not existe"}],
                post: null,
            }
        }

        // transform inputs to delete field if empty
        const payloadToUpdate = {
            title,
            content,
        }

        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;


        return {
            userErrors: [],
            post: prismaClient.post.update({
                data: {
                    ...payloadToUpdate,
                },
                where: {
                    id: Number(postId),
                },
            }),
        }
    },
    postDelete: async (
        parent: any,
        {postId}: { postId: String },
        {prismaClient}: Context
    ): Promise<PostPayloadType> => {
        const post = await prismaClient.post.findUnique({
            where: {
                id: Number(postId),
            }
        })

        // validate post exists
        if (!post) {
            return {
                userErrors: [{message: "Post does not existe"}],
                post: null,
            }
        }

        await prismaClient.post.delete({
            where: {
                id: Number(postId),
            }
        })

        return {
            userErrors: [],
            post,
        }
    }.
    userCreate: ()

}
