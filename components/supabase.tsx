// Cette fonction prend en paramètre le titre et le contenu du test
export async function sendTest(
  { supabase }: any,
  title: string,
  content: string
) {
  // On utilise l'instance de supabase pour insérer le test dans la table "tests"
  const { data, error } = await supabase
    .from("tests")
    .insert([{ title: title, content: content }]);
  // On vérifie s'il y a une erreur
  if (error) {
    // On affiche l'erreur dans la console
    console.error(error);
    // On retourne false pour indiquer que l'opération a échoué
    return false;
  } else {
    // On affiche le résultat dans la console
    // console.log(data);
    // On retourne true pour indiquer que l'opération a réussi
    return true;
  }
}
