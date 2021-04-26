import { useFetch } from "../hooks/useFetch";

export default function useCreateRecipe(recipe) {
  return useFetch("`/api/recipes`", "POST", JSON.stringify({ recipe }));
}
