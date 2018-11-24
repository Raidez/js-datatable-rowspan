(function($) {
	$.fn._defuse = function(table) {
		// réinitialise le tableau à l'origine
		table.find('td').attr('rowspan', '1').show();
	}

	$.fn._fusion = function(table) {
		// fusionne les cellules jumelles
		table.find('td').each(function() {
			var pearl = $(this);
			var attr = pearl.data('ref');
			if (typeof attr !== "undefined" && attr !== false) {
				var rowIdx = pearl.parent().index();
				var colIdx = pearl.index();
				var crystals = $.fn._recupJumelle(table, pearl, rowIdx, colIdx);

				if (crystals.up.length > 0 && crystals.dn.length > 0) {
					crystals.up.hide();
					crystals.dn.hide();
					crystals.up.first().show().attr('rowspan', crystals.up.length+crystals.dn.length+1);
				} else if (crystals.up.length > 0) {
					crystals.up.first().attr('rowspan', crystals.up.length+1);
					pearl.hide();
				} else if (crystals.dn.length > 0) {
					pearl.attr('rowspan', crystals.dn.length+1);
					crystals.dn.hide();
				}
			}
		});
	}

	$.fn._recupJumelle = function(table, cell, rowIdx, colIdx) {
		var rowCount = table.find('tr').not(':first').length;
		var attr = cell.data('ref');

		// récupère toutes les jumelles au-dessus
		var garnets = $();
		for (let i = rowIdx; i > 0; i--) {
			var g = table.find('tr').eq(i).find('td').eq(colIdx);
			if (attr === g.data('ref')) {
				garnets = garnets.add(g);
			} else {
				break;
			}
		}
		
		// récupère toutes les jumelles en-dessous
		var amethyst = $();
		for (let i = rowIdx+2; i < rowCount; i++) {
			var a = table.find('tr').eq(i).find('td').eq(colIdx);
			if (attr === a.data('ref')) {
				amethyst = amethyst.add(a);
			} else {
				break;
			}
		}
		
		return {
			'up': garnets,
			'dn': amethyst
		};
	}

	$.fn.ratatable = function(options=$.fn.dataTable.defaults) {
		var table = this;
		options['fusion'] = (typeof options['fusion'] !== 'undefined')? options['fusion'] : true;
		options['foot-searching'] = (typeof options['foot-searching'] !== 'undefined')? options['foot-searching'] : options['searching'];

		// ajout d'une ligne pour la recherche aux pieds du tableau
		if (options['foot-searching'] !== false) {
			var row = $('<tr />');
			table.find('th').each(function() {
				var th = $(this);
				if (!th.hasClass('no-search')) {
					var input = $('<input />', {
						'type': 'text',
						'placeholder': th.text()
					});
					row.append($('<td />').append(input));
				} else {
					row.append($('<td />'));
				}
			});
			$('<tfoot />').append(row).appendTo(table);
		}

		if (options['fusion'] !== false) {
			$.fn._fusion(table); // 1ère passe
			table.find('th').click(() => $.fn._defuse(table)); // à chaque tri, on défusione les jumelles
		}

		table['dt'] = table.DataTable(options);

		if (options['fusion'] !== false) {
			table.dt.on('order.dt', function() {
				$.fn._fusion(table); // puis on refusione les jumelles
			});
		}

		if (options['searching'] !== false && options['fusion'] !== false) {
			// après chaque recherche globale, on fusionne les cellules jumelles
			$('#' + table.attr('id') + '_filter input').unbind().bind('keyup', function(e) {
				$.fn._defuse(table);
				table.dt.search(this.value).draw();
				$.fn._fusion(table);
			});
		}

		if (options['foot-searching'] !== false) {
			// active la recherche par colonne
			table.dt.columns().every(function() {
				let that = this;
				$('input', this.footer()).on('keyup change', function() {
					if (that.search() !== this.value) {
						if (options['fusion'] !== false)
							$.fn._defuse(table);
						that.search(this.value).draw();
						if (options['fusion'] !== false)
							$.fn._fusion(table);
					}
				});
			});
		}

		return table.dt;
	};
})(jQuery);
