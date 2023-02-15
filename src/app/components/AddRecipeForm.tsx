"use client";

import { RecipeInterface } from "@/types/typings";
import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { useRef, useState } from "react";
// import { PhotoIcon } from "@heroicons/react/24/outline";

function AddRecipeForm() {
    const router = useRouter();
    // TODO: Image not supported yet. Implement once file storage is in place.

    // const [preview, setPreview] = useState<string>();
    // const [image, setImage] = useState<File>();
    // const imageInputRef = useRef<HTMLInputElement>(null);

    // const handleImageClick = () => {
    //     if (imageInputRef.current != null) {
    //         imageInputRef.current.click();
    //     }
    // };

    // const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files?.[0]) {
    //         setPreview(URL.createObjectURL(e.target.files[0]));
    //         setImage(e.target.files[0]);
    //     }
    // };

    const handleSaveRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as typeof e.target & {
            elements: {
                name: { value: string };
                description: { value: string };
                ingredients: { value: string };
                instructions: { value: string };
            };
        };
        const { name, description, ingredients, instructions } =
            target.elements;
        const recipe: RecipeInterface = {
            name: name.value,
            description: description.value,
            ingredients: ingredients.value,
            instructions: instructions.value,
        };

        const response = await fetch("/api/save-recipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe),
        });
        if (response.ok) {
            router.push("/recipes");
        } else {
            console.error("Something went wrong!");
        }
    };

    return (
        <form
            onSubmit={handleSaveRecipe}
            className="grid grid-cols-[max-content,1fr] gap-5"
        >
            {/* <div className="col-span-2 border w-fit p-5 justify-self-center">
                    <input
                        ref={imageInputRef}
                        type="file"
                        onChange={handleAddImage}
                        className="hidden"
                    />
                    {preview != null ? (
                        <Image
                            src={preview}
                            width={400}
                            height={400}
                            alt="Recipe Image"
                            onClick={handleImageClick}
                        />
                    ) : (
                        <PhotoIcon
                            onClick={handleImageClick}
                            className="w-96 h-96"
                        />
                    )}
                </div> */}
            <label>Name</label>
            <input type="text" name="name" className="border-2" />
            <label>Description</label>
            <input type="text" name="description" className="border-2" />
            <label>Ingredients</label>
            <input type="text" name="ingredients" className="border-2" />
            <label>Instructions</label>
            <input type="text" name="instructions" className="border-2" />

            <button
                type="submit"
                className="col-span-2 border-2 w-fit px-5 justify-self-center"
            >
                Save
            </button>
        </form>
    );
}

export default AddRecipeForm;