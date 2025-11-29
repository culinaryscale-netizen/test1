export const API_URL = import.meta.env.VITE_API_URL;

export async function getAllRecipes() {
  const res = await fetch(`${API_URL}/api/recipes`);
  if (!res.ok) throw new Error("Failed to load recipes");
  return res.json();
}

export async function getRecipeById(id: string) {
  const res = await fetch(`${API_URL}/api/recipes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.json();
}

export async function createRecipe(payload: any) {
  const res = await fetch(`${API_URL}/api/recipes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create recipe");
  return res.json();
}

export async function updateRecipe(id: string, payload: any) {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update recipe");
  return res.json();
}

export async function deleteRecipeById(id: string) {
  const res = await fetch(`${API_URL}/api/recipes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete recipe");
  return res.json();
}
