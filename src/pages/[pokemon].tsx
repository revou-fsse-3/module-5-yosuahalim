import { GetStaticPropsContext } from "next";
import Image from "next/image";
import React from "react";

type Props = {
  pokemon: Pokemon;
};

const PokemonPage = ({ pokemon }: Props) => {
  console.log(pokemon);

  return (
    <div className="flex justify-center">
      <Image
        className="w-[200px]"
        src={pokemon?.sprites?.front_default}
        alt=""
        height={200}
        width={200}
      />

      <div className="mt-4">
        <h2 className="text-left font-semibold text-lg">Status</h2>
        {pokemon?.stats?.map((stat, index) => (
          <div className="flex space-x-2" key={index}>
            <p>{stat.stat.name}</p>
            <p>{stat.base_stat}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonPage;

export async function getStaticPaths() {
  const paths = [
    { params: { pokemon: "pikachu" } },
    { params: { pokemon: "bulbasaur" } },
  ];
  return { paths, fallback: true };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${context.params?.pokemon}`
  );
  const data = await res.json();
  return { props: { pokemon: data } };
}
