"use client";

import {InitialLoadingScreen} from "@/components/InitialLoadingScreen/InitialLoadingScreen";
import {useLoadData_DetailedPokemonsArr} from "@/hooks/useLoadData_DetailedPokemonsArr";
import React, {useEffect} from "react";

function SearchPokemonEvPage() {
  useLoadData_DetailedPokemonsArr();

  useEffect(() => {}, []);

  return (
    <>
      <InitialLoadingScreen />
    </>
  );
}

export default SearchPokemonEvPage;
