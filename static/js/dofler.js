var accounts = [];
var hosts = [];
var host_id = null;
var account_id = null;
var socket = io();
var flagged_images = [];


function addImage(image) {
	// Check to see if the image that was just sent to us is already being
	// displayed.  If it isn't, then we will add it to the view.
	var nsfw_ceiling = parseInt($('#nsfw-ceiling').val())
	if ($('img[src="/images/file/' + image.filename + '"]').length < 1
		&& ((nsfw_ceiling && image.nsfw <  nsfw_ceiling) || !nsfw_ceiling)
		&& flagged_images.indexOf(image.filename) < 0
	){
		if ($('#debug').is(':checked')){
			console.log(image.filename + ' + with nsfw score ' + image.nsfw + ' drawn')
		}
		$('#images').prepend('<img class="dofler-img" src="/images/file/' + image.filename + '" onclick="removeImage(\'' + image.filename + '\')">');
	}else{
		if ($('#debug').is(':checked')){
			console.log(image.filename + ' with nsfw score ' + image.nsfw + ' NOT drawn')
		}
	}

	// As we only want to display the latest 200 images, we will want to
	// remove the oldest images once this limit has been reached.
	if ($('.dofler-img').length > 100){
		$('.dofler-img:last').remove()
	}
}


function removeImage(filename) {
	if ($('#removable-images').is(':checked')) {
		$('img[src="/images/file/' + filename + '"]').remove()
		flagged_images.push(filename)
	}
}


function addHost(host) {
	hosts.push(host);
}


function addAccount(account) {
	accounts.push(account);
}


function protoRefresh(reporting = false) {
	// Get the top 5 protocols from the API and then generate the flot graph
	// based on the data returned.
	var url = '/stats/protocols/5'
	if (reporting) {url = '/stats/protoreport/10'}
	$.getJSON(url, function(protos) {
		$.plot('#proto-analysis', protos, 
			{xaxis: { mode: "time", position: "right", timezone: "browser"},
			legend: {position: "nw", backgroundColor: null, backgroundOpacity: 0}
		});
	})
}


function protoList() {
	$.getJSON('/stats/protolist', function(protos) {
		$.each(protos, function(key, proto) {
			$('#proto-list').append('<li class="list-group-item"><span class="badge">' + proto.count + '</span>' + proto.name + '</li>')
		})
	})
}


function displayAccount(account, clip=true) {
	$('#account-total').html(accounts.length);

	$('#accounts-list > tbody').append(
		'<tr class="account-entry"><td>' +
		S(account.username || '').escapeHTML().substring(0,15) 	+ '</td><td>' +
		S(account.password || '').escapeHTML().substring(0,15) 	+ '</td><td>' +
		S(account.protocol || '').escapeHTML() 					+ '</td><td>' +
		S(account.dns || '').escapeHTML().substring(0,15) 		+ '</td></tr>'
	);
}

function displayHost(host, clip=true) {
	$('#host-total').html(hosts.length);

	$('#hosts-list > tbody').append(
		'<tr class="host-entry"><td>' +
		S(host.ip || '').escapeHTML() 	+ '</td><td>' +
		S(host.ports || '').escapeHTML() 	+ '</td></tr>'
	);
}

function renderAccountList() {
	if (accounts.length > 10) {
		for (var i in accounts.slice(0,10)) {displayAccount(accounts[i])}
	} else {
		for (var i in accounts) {displayAccount(accounts[i])}
	}
}

function renderHostList() {
	for (var i in hosts) {displayHost(hosts[i]);}
}

function accountCycle() {
	if (accounts.length > 10) {
		// If this is the first time the accounts have gone above 5, then we will
		// need to set the initial value.
		if (account_id == null) {account_id = 10;}

		// Increment the account_id counter.
		account_id++;

		// If the account_id counter exceeds the number of elements in the
		// accounts array, then we will need to rotate the id to the 
		// beginning of the array.
		if (account_id > accounts.length - 1) {
			account_id = account_id - accounts.length;
		}
		console.log(account_id)

		// Now to remove the first entry and add the last entry into the
		// user view.
		$('.account-entry:first').remove();
		displayAccount(accounts[account_id]);
		console.log(accounts[account_id]);
	}
}

function hostCycle() {
	if (hosts.length > 10) {
		if (host_id == null) {host_id = 10;}

		// Increment the account_id counter.
		host_id++;

		// If the account_id counter exceeds the number of elements in the
		// accounts array, then we will need to rotate the id to the 
		// beginning of the array.
		if (host_id > hosts.length - 1) {
			host_id = host_id - hosts.length;
		}
		console.log(host_id)

		// Now to remove the first entry and add the last entry into the
		// user view.
		$('.host-entry:first').remove();
		displayHost(hosts[host_id]);
		console.log(hosts[host_id]);
	}
}

function report() {
	$(document).ready(function () {
		$.getJSON('/images/common', function(images) {
			$.each(images, function(key, image) {
				$('#image-table').append('<tr><td>' + image.count + '</td><td><img class="dofler-img" src="/images/file/' + image.filename + '"></td></tr>');
			})
		});
		$.getJSON('/accounts/list', function(accounts) {
			$.each(accounts, function(key, account) {
				addAccount(account);
				displayAccount(account);
			})
		});
		$.getJSON('/hosts/list', function(hosts) {
			$.each(hosts, function(key, host) {
				addHost(host);
				displayHost(host);
			})
		});
		protoRefresh(true);
	})
}


function display() {
	socket.on('images', function(image) {
		addImage(image);
	})


	socket.on('accounts', function(account) {
		accounts.push(account);
	})


	socket.on('protocols', function(data){
		protoRefresh();
	})

	socket.on('hosts', function(host) {
		hosts.push(host);
	})


	$(document).ready(function () {
		$.getJSON('/images/list', function(images) {
			$.each(images, function(key, image) {
				addImage(image);
			})
		});
		$.getJSON('/accounts/list', function(account_list) {
			accounts = account_list;
			renderAccountList();
		});
		$.getJSON('/hosts/list', function(host_list) {
			host = host_list;
			renderHostList();
		});
		protoRefresh();
		setInterval(accountCycle, 1000);
		setInterval(hostCycle, 1000);
	})
}

