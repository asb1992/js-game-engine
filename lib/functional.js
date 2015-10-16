// Functional programming tools, courtesy of examples at eloquentjavascript.net

// just a component
function forEach(array, action) {

	for (var i = 0; i < array.length; i++) {
		
		action(array[i]);
		
	}

}

// applies some transformation to all elements of an array.
function map(func, array) {

	var result = [];
	
	forEach(array, function (element) {
	
		result.push(func(element));
		
	});
	
	return result;
	
}

// combines all elements of an array into one value.
function reduce(combine, base, array) {

	forEach(array, function (element) {
	
		base = combine(base, element);
		
	});
	
	return base;
	
}

// just a component.
function asArray(quasiArray, start) {

	var result = [];
	
	for (var i = (start || 0); i < quasiArray.length; i++) {
	
		result.push(quasiArray[i]);
		
	}
	
	return result;
	
}

function partial(func) {

	var fixedArgs = asArray(arguments, 1);
	
	return function() {
	
		return func.apply(null, fixedArgs.concat(asArray(arguments)));
		
	};
	
}

// returns an array of all elements in the passed array
// for which the test returned true.
function filter(test, array) {
	
	var result = [];
	
	forEach(array, function (element) {
		
		if (test(element)) result.push(element);
		
	});
	
	return result;
}

// applies a test to all elements of an array,
// returning true if ever the test does.
function any(test, array) {
	
	for (var i = 0; i < array.length; i++) {
		
		var found = test(array[i]);
		if (found) return found;
		
	}
	
	return false;
	
}