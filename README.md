## Qu'est-ce que c'est ?

C'est un plugin custom fait par mes soins (c'est un euphémisme),
qui ajoute la fonctionnalité de fusionner des cellules adjacentes
dans un tableau (utilisant le plugin datatable de jQuery).

J'ai créer ce plugin à le demande de ma boîte, car le plugin **rowsGroup** n'était pas à leur goût,
*surtout que le tri n'était alors que sur les colonnes groupés*.



## Comment ça marche ?

Basiquement, il suffit de créer un tableau :
```
	<table id="maTable">
		<thead>
			<tr>
				<th class="no-search"> ID </th>
				<th> Nom </th>
				<th> Date </th>
				<th> Document </th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td data-ref="0"> 0 </td>
				<td data-ref="0"> yaourt </td>
				<td> 23/11 </td>
				<td> specs.pdf </td>
			</tr>
			<tr>
				<td data-ref="0"> 0 </td>
				<td data-ref="0"> yaourt </td>
				<td> 20/10 </td>
				<td> photo.jpg </td>
			</tr>
			
			<tr>
				<td data-ref="1"> 1 </td>
				<td data-ref="1"> viande </td>
				<td> 24/12 </td>
				<td> certif.pdf </td>
			</tr>
			<tr>
				<td data-ref="1"> 1 </td>
				<td data-ref="1"> viande </td>
				<td> 20/10 </td>
				<td> photo.jpg </td>
			</tr>
		</tbody>
	</table>
```
Et au chargement de la page :
```
	$('#maTable').ratatable();
```
Et le plugin, va lors de divers événement, fusionner toutes les cellules adjacentes ayant un attribut ***data-ref*** définit et égaux.

Sachant que comme le plugin datatable de base, ratatable accepte des options.
```
	$('#maTable').ratatable({
		'info': false,
		'searching': false
	});
```

Et si vous ne voulez pas activer la fusion des cellules pour revenir au comportement de base de datatable
(*ce qui est un peu stupide, puisque ce plugin ne vous sert alors à rien ;)*),
il existe l'option ***fusion*** qui de base est actif.
```
	// active le comportement de base de datatable, sans utiliser mon SUPER plugin
	$('#maTable').ratatable({
		'fusion': false
	});

	// ce qui est COMPLEMENT équivalent à ça
	$('#maTable').DataTable();
```

AH ! Et enfin, le plugin ajoute une propriété ***dt*** qui contient l'api de la table générée,
qui est également renvoyer par la fonction ***ratatable***
```
	var table = $('#maTable');
	var dt = table.ratatable();
	console.log(table.dt == dt); // renvoi TRUE
```
Avec ça, vous pouvez alors utiliser comme bon vous semble l'api de datatable (*c'est cadeau*).

Encore plus de cadeau, le plugin ajoute également un pied au tableau pour faire une recherche par colonne
(*activé de base mais toujours configurable avec les options*).
```
	$('#maTableEncoreEtToujours').ratatable({
		'foot-searching': false // et voilà plus de recherche aux pieds
	});

	// OU ALORS
	$('#maTableEncoreEtToujours').ratatable({
		'searching': false
	});
```
Il est également possible d'ajouter la classe ***.no-sort*** aux entêtes dont on ne veut pas la recherche.

## Comment ça marche *techniquement* ?

Le plugin **datatable** n'acceptant pas les rowspans, colspans (ou alors avec un comportement bizarre).
Il faut un moyen de reconnaitre les celulles qui seront fusionné (d'où l'utilisation de l'attribut **data-ref**).

2 fonctions sont alors utilisé:  
- $.fn._fusion() => qui fusionne les cellules adjacentes
- $.fn._defuse() => qui enlève les rowspans définit par le plugin

Ces fonctions sont appelés à chaque événement majeur modifiant le tableau (recherche, triage).



## FAQ

1. on peut l'utiliser pour fusionner des celulles horizontalement (colspan) ? *NON*
2. tu vas continuer à travailler dessus (correction de bug) ? *NON*
3. ça bug ! *pas de chance*
4. je peux le modifier ? le détruire ? faire de la pâte à modeler avec ? *vas-y j'ai même laisser des commentaires exprès*
5. tes explications ne sont pas claire ! *tanpis*
6. pourquoi *ratatable* ? *raidez (mon pseudo) + datatable, en plus ça me fait penser au pokémon ratatta ;)*
7. ton code est infâme !!! *t'as pas vu le TIENS !*
8. ya dé fotes d'ortograf ! *..., j'fais ce que je peux :'(*
