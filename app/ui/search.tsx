'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);
   
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 350);
  

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}


// useDebouncedCallback((term) => {...}, 300)
// Estás actualizando la URL con cada pulsación de tecla y,
//  por lo tanto, estás consultando tu base de datos con cada
//   pulsación de tecla. Esto no es un problema ya que nuestra
//   aplicación es pequeña, pero imagina si tu aplicación tuviera
//    miles de usuarios, cada uno de los cuales enviara una nueva
//     solicitud a tu base de datos con cada pulsación de tecla.

// La eliminación de rebotes es una práctica de programación
//  que limita la velocidad a la que se puede ejecutar una
//   función. En nuestro caso, solo desea consultar la base
//    de datos cuando el usuario haya dejado de escribir.

// Al eliminar el rebote, puede blueucir la cantidad de solicitudes
//  enviadas a su base de datos, ahorrando así recursos.




// ${pathname} en remplace -> handleSearch()
// es la ruta actual, en este caso, "/dashboard/invoices".
// A medida que el usuario escribe en la barra de búsqueda, params.toString()
// traduce esta entrada a un formato compatible con URL. 

// replace(${pathname}?${params.toString()})actualiza la URL 
// con los datos de búsqueda del usuario. Por ejemplo,
// /dashboard/invoices?query=lee si el usuario busca "Lee".

// La URL se actualiza sin recargar la página, gracias a la 
// navegación del lado del cliente de Next.js 
// (que aprendiste en el capítulo sobre cómo navegar entre páginas ).




// defaultValuevs. en input

// Si usas el estado para administrar el valor de una entrada,
//  usarías el valueatributo para convertirlo en un componente
//   controlado. Esto significa que React administraría el estado de la entrada.

//  Sin embargo, dado que no estás usando el estado,
//  puedes usar defaultValue. Esto significa que la
//  entrada nativa administrará su propio estado.
//   Esto está bien ya que estás guardando la consulta
//    de búsqueda en la URL en lugar de en el estado.