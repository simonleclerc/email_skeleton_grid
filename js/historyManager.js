function HistoryManager(){
    this.maxEntry = 5;
    this.previous = {};
    this.actual = {};
    this.next = {};
    this.localStorageName = 'historyManager';
    this.useLocalStorage = true;
    this.addEntry = function(state, message){
        message = message === undefined ? '' : message;
        if(Object.keys(this.actual) > 0) {
            this.previous[Object.keys(this.actual)[0]] = {
                state: this.actual[Object.keys(this.actual)[0]].state,
                message: this.actual[Object.keys(this.actual)[0]].message
            }

            this.actual = {};
        }
        this.actual[new Date().getTime()] = {state: state, message: message};

        if(Object.keys(this.previous).length > this.maxEntry) {
            delete this.previous[Math.min.apply(Math, Object.keys(this.previous))];
        }
        if(this.useLocalStorage) {
            localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
        }
    };
    this.getAllEntries = function() {
        return {
            previous: this.previous,
            actual: this.actual,
            next: this.next
        }
    };
    this.goToLastPreviousEntry = function(){
        if(Object.keys(this.previous).length > 0) {
            var historyKeys = Object.keys(this.previous);
            var maxItem = historyKeys.indexOf(Math.max.apply(Math, historyKeys) + '');
            var removedHistoryKey = historyKeys.splice(maxItem, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.next[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.previous[removedHistoryKey].state,
                message: this.previous[removedHistoryKey].message
            };

            delete this.previous[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToFirstPreviousEntry = function(){
        if(Object.keys(this.previous).length > 0) {
            var historyKeys = Object.keys(this.previous);
            var minItem = historyKeys.indexOf(Math.min.apply(Math, historyKeys) + '');
            var removedHistoryKey = historyKeys.splice(minItem, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.next[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < historyKeys.length; i++){
                this.next[historyKeys[i]] = {
                    state: this.previous[historyKeys[i]].state,
                    message: this.previous[historyKeys[i]].message
                }
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.previous[removedHistoryKey].state,
                message: this.previous[removedHistoryKey].message
            };

            this.previous = {};

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToFirstNextEntry = function(){
        if(Object.keys(this.next).length > 0) {
            var historyKeys = Object.keys(this.next);
            var minItem = historyKeys.indexOf(Math.min.apply(Math, historyKeys) + '');
            var removedHistoryKey = historyKeys.splice(minItem, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.previous[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.next[removedHistoryKey].state,
                message: this.next[removedHistoryKey].message
            };

            delete this.next[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToLastNextEntry = function(){
        if(Object.keys(this.next).length > 0) {
            var historyKeys = Object.keys(this.next);
            var maxItem = historyKeys.indexOf(Math.max.apply(Math, historyKeys) + '');
            var removedHistoryKey = historyKeys.splice(maxItem, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.previous[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < historyKeys.length; i++){
                this.previous[historyKeys[i]] = {
                    state: this.next[historyKeys[i]].state,
                    message: this.next[historyKeys[i]].message
                }
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.next[removedHistoryKey].state,
                message: this.next[removedHistoryKey].message
            };

            this.next = {};

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToNthPreviousEntryFromEnd = function(nth){
        if(Object.keys(this.previous).length > 0 && nth > 0) {
            var historyKeys = Object.keys(this.previous);
            historyKeys.sort(sortNumber).reverse();

            var toMoveHistoryKey = historyKeys.splice(0, nth-1);
            var removedHistoryKey = historyKeys.splice(0, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.next[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < toMoveHistoryKey.length; i++){
                this.next[toMoveHistoryKey[i]] = {
                    state: this.previous[toMoveHistoryKey[i]].state,
                    message: this.previous[toMoveHistoryKey[i]].message
                }
                delete this.previous[toMoveHistoryKey[i]];
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.previous[removedHistoryKey].state,
                message: this.previous[removedHistoryKey].message
            };
            delete this.previous[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToNthPreviousEntryFromStart = function(nth){
        if(Object.keys(this.previous).length > 0 && nth > 0) {
            var historyKeys = Object.keys(this.previous);
            historyKeys.sort(sortNumber);

            var toMoveHistoryKey = historyKeys.splice(0, nth-1);
            var removedHistoryKey = historyKeys.splice(0, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.next[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < toMoveHistoryKey.length; i++){
                this.next[toMoveHistoryKey[i]] = {
                    state: this.previous[toMoveHistoryKey[i]].state,
                    message: this.previous[toMoveHistoryKey[i]].message
                }
                delete this.previous[toMoveHistoryKey[i]];
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.previous[removedHistoryKey].state,
                message: this.previous[removedHistoryKey].message
            };
            delete this.previous[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToNthNextEntryFromStart = function(nth){
        if(Object.keys(this.next).length > 0 && nth > 0) {
            var historyKeys = Object.keys(this.next);
            historyKeys.sort(sortNumber);

            var toMoveHistoryKey = historyKeys.splice(0, nth-1);
            var removedHistoryKey = historyKeys.splice(0, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.previous[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < toMoveHistoryKey.length; i++){
                this.previous[toMoveHistoryKey[i]] = {
                    state: this.next[toMoveHistoryKey[i]].state,
                    message: this.next[toMoveHistoryKey[i]].message
                }
                delete this.next[toMoveHistoryKey[i]];
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.next[removedHistoryKey].state,
                message: this.next[removedHistoryKey].message
            };
            delete this.next[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.goToNthNextEntryFromEnd = function(nth){
        if(Object.keys(this.next).length > 0 && nth > 0) {
            var historyKeys = Object.keys(this.next);
            historyKeys.sort(sortNumber).reverse();

            var toMoveHistoryKey = historyKeys.splice(0, nth-1);
            var removedHistoryKey = historyKeys.splice(0, 1);

            var historyActualKeys = Object.keys(this.actual);
            this.previous[historyActualKeys[0]] = {
                state: this.actual[historyActualKeys[0]].state,
                message: this.actual[historyActualKeys[0]].message
            };
            for (var i = 0; i < toMoveHistoryKey.length; i++){
                this.previous[toMoveHistoryKey[i]] = {
                    state: this.next[toMoveHistoryKey[i]].state,
                    message: this.next[toMoveHistoryKey[i]].message
                }
                delete this.next[toMoveHistoryKey[i]];
            }

            this.actual = {};
            this.actual[removedHistoryKey] = {
                state: this.next[removedHistoryKey].state,
                message: this.next[removedHistoryKey].message
            };
            delete this.next[removedHistoryKey];

            if(this.useLocalStorage) {
                localStorage.setItem(this.localStorageName, JSON.stringify(this.getAllEntries()));
            }
            return this.actual[removedHistoryKey];
        }
    };
    this.importHistory = function(historyToImport) {
        this.previous = historyToImport.previous;
        this.actual = historyToImport.actual;
        this.next = historyToImport.next;
    };
}
