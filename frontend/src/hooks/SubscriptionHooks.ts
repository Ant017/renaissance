import { AddToCartApi, RemoveFromCartApi, AddToWishlistApi, RemoveFromWishlistApi, SubscribeApi, RespondToSubscribeApi } from "../ApiCalls/SubscriptionApi";
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type Carts = {
    _id?: string;
    studentID?: string;
    courseID?: {
        title?: string;
        thumbnail?: string;
        topicName?: string;
        description?: string;
        _id?: string;
        rating?: number;
        language?: string;
    };
};

const useSubscription = () => {

    const addToCart = useCallback(
        async (data: any, token: string) => {
            console.log("token from hook", token, data);
            try {
                await AddToCartApi(data, token);
                console.log("response from hook");
                // After adding to the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    );

    const addToWishlist = useCallback(
        async (data: any, token: string) => {
            console.log("token from hook", token, data);
            try {
                await AddToWishlistApi(data, token);
                console.log("response from hook");
                // After adding to the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    );

    const subscribe = useCallback(
        async (data: any, token: string) => {
            console.log("token from hook", token, data);
            try {
                await SubscribeApi(data, token);
                console.log("response from hook");
                // After adding to the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    );

    const removeFromCart = useCallback(
        async (courseID: string, cartID: string, token: string) => {
            console.log("token from hook", token);
            try {
                await RemoveFromCartApi(cartID, courseID, token);
                console.log("response from hook");
                // After removing from the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    );

    const respondToSubscribe = useCallback(
        async (data: string, notificationID: string, token: string) => {
            console.log("token from hook", token);
            try {
                await RespondToSubscribeApi(data, notificationID, token);
                console.log("response from hook");
                // After removing from the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    )

    const removeFromWishlist = useCallback(
        async (courseID: string, cartID: string, token: string) => {
            console.log("token from hook", token);
            try {
                await RemoveFromWishlistApi(cartID, courseID, token);
                console.log("response from hook");
                // After removing from the cart, you might want to update the cart again
                // You can call fetchCart here or any other logic to update the cart
            } catch (error: any) {
                console.log(error);
            }
        },
        []
    );


    return {
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        subscribe,
        respondToSubscribe
    };
};

export default useSubscription;
