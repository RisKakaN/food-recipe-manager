import {
    Recipe,
    RecipeFormErrors,
    RecipeImage,
    RecipeIngredient,
    RecipeInstruction,
    RecipeRequestBody,
    RecipeRequestDeleteBody,
} from "@/types/typings";
import { toBase64Image } from "@/utils/Utils";

/**
 * Remove fields that are empty.
 * This applies to fields that are optional, and if those fields are empty, we do not need to store them in the database.
 */
export const sanitizeRecipe = (recipe: Recipe): Recipe => {
    const { time, servings, ingredients, instructions } = recipe;
    return {
        ...recipe,
        time: time === "" ? undefined : time,
        servings: servings?.toString() === "" ? undefined : servings,
        ingredients: ingredients.map((ingredient) => {
            if (ingredient.amount?.toString() === "") {
                return { id: ingredient.id, name: ingredient.name };
            } else {
                return ingredient;
            }
        }),
        instructions: removeEmptyInstructions(instructions),
    };
};

export const removeEmptyInstructions = (instructions: RecipeInstruction[]) =>
    instructions.filter((instruction) => instruction.description !== "");

export const isRecipeValid = (recipe: Recipe) => {
    const { name, description, ingredients, instructions } = recipe;
    return (
        name !== "" &&
        description !== "" &&
        ingredients.length > 0 &&
        instructions.length > 0
    );
};

export const getFormErrors = (recipe: Recipe): RecipeFormErrors => {
    const { name, description, ingredients, instructions } = recipe;
    return {
        name: name === "",
        description: description === "",
        ingredients: ingredients.length === 0,
        instructions: instructions.length === 0,
    };
};

export const isIngredientValid = (ingredient: RecipeIngredient) => {
    const { amount, unit, name } = ingredient;
    if (name === "") {
        return { isValid: false, message: "Ingredient is missing a name." };
    }

    if (
        amount != null &&
        amount.toString() !== "" &&
        (unit == null || unit === "")
    ) {
        return {
            isValid: false,
            message: "Ingredient unit is needed if amount is specified",
        };
    }

    if (
        unit != null &&
        unit.toString() !== "" &&
        (amount == null || amount.toString() === "")
    ) {
        return {
            isValid: false,
            message: "Ingredient amount is needed if unit is specified.",
        };
    }
    return { isValid: true, message: "Success." };
};

export const addNewRecipe = async (
    recipe: Recipe,
    imageFile: File | undefined
): Promise<string> => {
    const { name, description, time, servings, ingredients, instructions } =
        recipe;

    const requestBody: RecipeRequestBody = {
        name,
        description,
        time,
        servings,
        ingredients,
        instructions,
    };

    if (imageFile != null) {
        try {
            const base64Image = await toBase64Image(imageFile);
            requestBody.newImage = {
                data: base64Image,
                type: imageFile.type,
            };
        } catch (error) {
            return Promise.reject("Could not process image.");
        }
    }

    const response = await fetch("/api/add-recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        const recipeId: string = await response
            .json()
            .then((result) => result.recipeId)
            .catch(() => {
                return Promise.reject("Could not get new recipe.");
            });
        return Promise.resolve(recipeId);
    } else {
        return Promise.reject("Could not add recipe.");
    }
};

export const editRecipe = async (
    recipeId: string | undefined,
    recipe: Recipe,
    newImageFile: File | undefined,
    preview: string | undefined
) => {
    if (recipeId == null) {
        return Promise.reject("Recipe id is missing.");
    }
    const requestBody: RecipeRequestBody = {
        recipeId: recipeId,
        name: recipe.name,
        description: recipe.description,
        time: recipe.time,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        oldImage: recipe.image,
    };

    if (newImageFile != null) {
        try {
            const base64Image = await toBase64Image(newImageFile);
            requestBody.newImage = {
                data: base64Image,
                type: newImageFile.type,
            };
        } catch (error) {
            return Promise.reject("Could not process image.");
        }
    } else if (recipe.image != null && preview == null) {
        requestBody.removeImage = true;
    }

    const response = await fetch("/api/edit-recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        return Promise.resolve();
    } else {
        return Promise.reject("Could not edit recipe.");
    }
};

export const deleteRecipe = async (
    recipeId: string | undefined,
    image: RecipeImage | undefined
) => {
    if (recipeId == null) {
        return Promise.reject("Recipe id is missing.");
    }
    const requestBody: RecipeRequestDeleteBody = {
        recipeId,
        image,
    };

    const response = await fetch("/api/delete-recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (response.ok) {
        return Promise.resolve();
    } else {
        return Promise.reject("Could not delete recipe.");
    }
};
