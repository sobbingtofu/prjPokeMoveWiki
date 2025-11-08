import React from "react";

interface pageProps {
  params: {pokemonId: string};
}

function page({params}: pageProps) {
  return <div>page {params.pokemonId}</div>;
}

export default page;
