import PageHeader from "@/components/PageHeader";
import CreateRecipeForm from "@/components/CreateRecipeForm";

export default function AddRecipePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Add Recipe"
          description="Create a new recipe for your collection."
          actionLabel="Back to Recipes"
          actionHref="/recipes"
        />

        <CreateRecipeForm />
      </div>
    </div>
  );
}