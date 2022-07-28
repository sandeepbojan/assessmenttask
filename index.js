// your code goes here ...
/**
 * class Relative 
 * JSClass to encapsulate relative information
 */
 function Relative(age, relationship, isSmoker) {
    this.id = (new Date()).getTime(); // Using Timestamp as ID for uniqueness
    this.age = age;
    this.relationship = relationship;
    this.isSmoker = isSmoker;
  }
  
  /**
   * Relative.validate
   * function to check for validity of values.
   */
  Relative.prototype.validate = function() {
    var error = [];
  
    if (isNaN(this.age)) {
      error.push("Age should be a number");
    } else if (this.age <= 0) {
      error.push("Age should be more than 0");
    }
  
    if (!this.relationship) {
      error.push("Relationship is required");
    }
  
    return error;
  };
  
  /**
   * class RelativeManager
   * this will be the one that manages the form and the elements in it
   * this will also be responsible for compiling and
   * submitting the form to person
   */
  function HouseholdManager() {
    this.relatives = [];
  }
  
  HouseholdManager.prototype.addRelative = function(relative) {
    var errors = relative.validate();
    if (errors.length > 0) {
      throw { errors: errors };
    }
  
    this.relatives.push(relative);
  };
  
  HouseholdManager.prototype.removeRelative = function(relativeId) {
    var index = this.relatives.findIndex(function(relative) {
      return relative.id === relativeId;
    });
  
    this.relatives.splice(index, 1);
  };
  
  HouseholdManager.prototype.serialize = function() {
    return JSON.stringify(this.relatives.map(function(relative) {
      return {age: relative.age, relationship: relative.relationship, isSmoker: relative.isSmoker };
    }), null, 2);
  }
  
  /** 
   *  Manage DOM, HTML, and event listeners
   */
  function FormManager () {
    this.addButton = document.querySelector("button.add");
    this.submitButton = document.querySelector("button[type='submit']:not(.add)");
    this.resultsArea = document.querySelector("pre.debug");
  
    //form handlers
    this.formElement = document.querySelector("form");
    this.relationshipInput = document.querySelector("form select[name=rel]");
    this.smokerInput = document.querySelector("form input[name=smoker]");
    this.ageInput =  document.querySelector("form input[name=age]");
    this.debugArea = document.querySelector("pre.debug");
    this.householdList = document.querySelector("ol.household");
    this.householdManager = new HouseholdManager();
  
    // Error list handler
    
    this.errorList = document.createElement("div");
    this.errorList.setAttribute("id", "error-list");
  
    this.formElement.insertBefore(this.errorList, this.formElement.firstChild);
  }
  
  // Event handlers
  FormManager.prototype.handleAddRelative = function(e) {
    e.preventDefault();
    // get events
    var age = this.ageInput.value;
    var relationship =  this.relationshipInput.value;
    var isSmoker = this.smokerInput.checked;
      
    this.removeErrorMessage();
    try {
      this.householdManager.addRelative(
        new Relative(age, relationship, isSmoker)
      );
  
      this.clearForm();
      this.renderList();
    } catch (e) {
      this.addErrorMessage(e);
    } 
  
  }
  
  FormManager.prototype.handleDelete = function(e) {
    var id = e.target.parentElement.getAttribute("id");
    this.householdManager.removeRelative(parseInt(id));
    this.renderList();
  }
  
  FormManager.prototype.handleSubmit = function(e) {
    e.preventDefault();
    var serialize = this.householdManager.serialize();
    this.debugArea.innerText = serialize;
    this.resultsArea.style.display = "block";
  }
  
  /**
   * Builds the HTML for the list
   */
  FormManager.prototype.renderList = function() {
    //clear area
    this.householdList.innerHTML = "";
  
    for (var i = 0; i < this.householdManager.relatives.length; i++) {
      var relative = this.householdManager.relatives[i];
  
      var li = document.createElement('li');
      var age = document.createElement('span');
      var relationship = document.createElement("span");
      var isSmoker = document.createElement("span");
      var deleteButton = document.createElement("button");
      
      li.setAttribute("id", relative.id);
      age.innerText = "Age: " + relative.age + "; ";
      relationship.innerText = "Relationship: " + relative.relationship + "; ";
      isSmoker.innerText = "Is a smoker: " + (relative.isSmoker ? "YES" : "NO") + "  ";
      deleteButton.innerText = "DELETE";
  
      deleteButton.onclick = this.handleDelete.bind(this);
  
      li.append(age);
      li.append(relationship);
      li.append(isSmoker);
      li.append(deleteButton);
  
      this.householdList.append(li);
    }
  }
  
  FormManager.prototype.clearForm = function() {
    this.ageInput.value = "";
    this.relationshipInput.selectedIndex = null;
    this.smokerInput.checked = false;
  }
  
  FormManager.prototype.removeErrorMessage = function() {
    this.errorList.innerHTML = "";
  }
  
  FormManager.prototype.addErrorMessage = function (e) {
    this.errorList.innerHTML = "Error: " + e.errors.join("; ");
  }
  
  FormManager.prototype.initializeEvents = function() {
    this.addButton.onclick = this.handleAddRelative.bind(this);
    this.submitButton.onclick = this.handleSubmit.bind(this);
  }
  
  /**
   * Declare Singleton
   */
  
   var formManager = new FormManager();
  
   formManager.initializeEvents();