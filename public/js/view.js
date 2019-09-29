$(document).ready(function() {
    // The initial repos array
    let currentRepos = [];
  
    // The initial tags array
    let tags = [];
  
    // The initial repo tags array
    let repoTags = [];
  
    // Initial repoID, used when click on Add Tag, this is the mysql integer id, not the GitHub string id
    let repoID = 0;
  
    // All the db repos
    let dbRepos = [];
  
    // This function displays repos from the database
    function initializeRows(currentRepos) {
      console.log('In Initialize Rows');
  
      // Lets filter to just public for now, need to make this an option
      currentRepos = currentRepos.filter(repo => repo.repoPrivate == 0);
      console.log('currentRepos length', currentRepos.length);
  
      // Build the card column element
      const cardCol = $('<div>');
      cardCol.addClass('card-columns');
  
      // Declare imgI
      let imgI = 0;
  
      // Loop over the db repos
      for (let i = 0; i < currentRepos.length; i++) {
        // Build the card elements
        const divCard = $('<div>');
        divCard.addClass('card');
  
        // Remove all the elements and then rebuild so we can see the new repotags
        $('.card').remove();
  
        // Set the width of the card
        divCard.css('width', '15rem');
  
        // Array of images for the cards
        // todo This will eventually be a user function to be able to assign custom images
        const arrImages = [
          '../images/bamazon.png',
          '../images/clicky.png',
          '../images/friend.png',
          '../images/beer.png',
          '../images/puppypicker.png',
          '../images/edshifts.png',
          '../images/hangman.png',
          '../images/sportairsouth.png',
          '../images/clicky2.png',
          '../images/train.png',
        ];
  
        // Build the card image
        const cardImg = $('<img>');
        cardImg.addClass('card-img-top');
  
        // Reuse the repo images
        if (imgI === 10) {
          imgI = 0;
        }
  
        // Set the image src
        const src = arrImages[imgI];
        cardImg.attr('src', src);
  
        // Increment the integer for the array of repo images
        imgI += 1;
  
        // Build the card body
        const divCardBody = $('<div>');
        divCardBody.addClass('card-body');
  
        // Call the function that gets all the repo tags for this repo (passes the repo id)
        const matchingTags = getRepoTags(repoTags, currentRepos[i].id);
        console.log('Start Building Repo Tags list');
  
        // Build the div to hold all the assigned tags
        if (matchingTags.length > 0) {
          for (let i = 0; i < matchingTags.length; i++) {
            // Now build the div to hold the tags
            const btnAssocTag = $('<button>');
            btnAssocTag.addClass('btn btn-sm btnRepoTags');
            btnAssocTag.css('background-color', matchingTags[i].tagColor);
            btnAssocTag.text(matchingTags[i].tagName);
            btnAssocTag.attr('data-id', matchingTags[i].id);
            divCardBody.append(btnAssocTag);
          }
          // Put a hard return after the tag to separate from the assign button
          const hr = $('<hr>');
          divCardBody.append(hr);
        }
  
        // Build the Assign Tag button
        const cardTags = $('<div>');
        const btnAssignTag = $(
          `<button id="${currentRepos[i].id}" type="button" class="btn btn-success btn-sm btnAssign" rel="popover" title="Add a Tag to ${currentRepos[i].repoName} <a href='#' class='close' data-dismiss='alert'>&times;</a>"
          >Assign Tag</button>`
        );
        cardTags.append(btnAssignTag);
        const cardH5 = $('<h5>');
        cardH5.addClass('card-title');
        cardH5.html(currentRepos[i].repoName);
  
        const cardPrivate = $('<p>');
        let repoPrivate = '';
        if (currentRepos[i].repoPrivate === true) {
          repoPrivate = 'Yes';
        } else {
          repoPrivate = 'No';
        }
        cardPrivate.html(`Private Repo: ${repoPrivate}`);
  
        // Format the last edited time
        const repoDate = moment(currentRepos[i].timestamp).format(
          'MMMM Do YYYY, h:mm a'
        );
  
        const cardTime = $('<p>');
        cardTime.html(`Last Edited: ${repoDate}`);
  
        const cardLink = $('<a>');
        cardLink.addClass('btn btn-primary');
        cardLink.attr('href', currentRepos[i].repoURL);
        cardLink.attr('target', '_blank');
        cardLink.text('Go to Repo');
        cardLink.addClass('link');
  
        divCardBody.append(cardTags, cardH5, cardPrivate, cardTime, cardLink);
        divCard.append(cardImg, divCardBody);
  
        cardCol.append(divCard);
      }
      // Append the cards to the index.html div
      $('#results').append(cardCol);
    } // End Initialize Rows
  
    // Function to display the tags
    function displayTags() {
      console.log('In display tags');
  
      // Loop over the db tags
      for (let i = 0; i < tags.length; i++) {
        // Create the tag buttons
        const btnTag = $('<button>');
        btnTag.addClass('btn btn-sm tag');
        btnTag.attr('id', tags[i].id);
        btnTag.attr('data-toggle', 'modal');
        btnTag.attr('data-target', '#tagModal');
        btnTag.css('background-color', tags[i].tagColor);
        btnTag.text(tags[i].tagName);
  
        // Create the Repo Tag popover tag buttons
        const popTag = $('<button>');
        popTag.addClass('btn btn-sm popTag');
        popTag.css('background-color', tags[i].tagColor);
        popTag.attr('id', tags[i].id);
        popTag.text(tags[i].tagName);
  
        // Append to the tags div
        $('#tags').append(btnTag);
  
        // Append to the popTags div
        $('#popTags').append(popTag);
      } // End display tags
  
      // Pipe ascii
      const pipe = String.fromCharCode(124);
  
      // Append pipe after last tag
      $('#tags').append(pipe);
  
      // Create Add Tag Button
      const btnAddTag = $('<button>');
      btnAddTag.text('Add Tag');
      btnAddTag.addClass('btn btn-sm btn-success btnAdd');
  
      // Create Clear Filter Button
      const btnClearFilter = $('<button>');
      btnClearFilter.text('Clear Filter');
      btnClearFilter.addClass('btn btn-sm btn-info clear');
  
      // Append Add Tag and Clear Filter Buttons
      $('#tags').append(btnAddTag);
      $('#tags').append(btnClearFilter);
    } // End Display Tags
  
    // Function to map to just the api repo ids
    function getJustApiID(item) {
      const apiID = item.id;
      return apiID;
    }
  
    // Function to map to just the db repo ids
    function getJustDbID(item) {
      const dbID = item.repoID;
      return dbID;
    }
  
    // This function inserts a new repo into our database and then updates the view
    function insertRepo(difference, api) {
      console.log('Post a repo');
  
      // Create an Array to hold the different repos
      const newRepos = [];
  
      // Now create an array of objects with the repos we want to add
      for (let i = 0; i < difference.length; i++) {
        const reposToAdd = api.filter(function(repo) {
          return repo.id === difference[i];
        });
  
        // Create an object to push
        const objRepo = {
          repoID: reposToAdd[0].id,
          repoName: reposToAdd[0].name,
          repoURL: reposToAdd[0].url,
          repoPrivate: reposToAdd[0].isPrivate,
          timestamp: reposToAdd[0].updatedAt,
        };
  
        // Push the object to the array
        newRepos.push(objRepo);
      }
  
      // Wrap the array in an object
      const repos = { newRepos };
  
      // Now send the different repos to the post route to add to the db
      $.post('/api/repos', repos).then(function(data) {
        console.log('Data!!!!', data);
  
        // Put the response in an array
        currentRepos = data;
  
        // Call the function that displays the cards
        initializeRows(currentRepos);
      });
    } // End Insert Repo
  
    // Use Async/Await to get the repos from both the api and db
    // so they return at the same time so I can compare
    async function getAllRepos() {
      try {
        console.log('getAllRepos Aysnc/Await has started');
  
        // Declare the routes
        // API repos
        const repoPromise = $.get('/api/repos');
  
        // db repos
        const dbRepoPromise = $.get('/api/dbRepos');
  
        // repo Tags repos
        const dbRepoTagsPromise = $.get('/api/dbRepoTags');
  
        // Wait for both to resolve
        const [api, db, dbRepoTags] = await Promise.all([
          repoPromise,
          dbRepoPromise,
          dbRepoTagsPromise,
        ]);
        console.log('API:', api);
        console.log('DB:', db);
        console.log('RepoTags:', dbRepoTags);
  
        // Reassign the arrays
        repoTags = dbRepoTags;
        dbRepos = db;
  
        // Get just the API repo ids
        const apiIDs = api.map(getJustApiID);
  
        // Get just the db repo ids
        const dbIDs = db.map(getJustDbID);
  
        // Compare the arrays and get what's different
        const difference = apiIDs.filter(x => !dbIDs.includes(x));
        console.log(difference);
  
        // Call the route to insert the repos
        // Check if there are any new repos to add, if not, just call initializeRows
        if (difference.length !== 0) {
          insertRepo(difference, api);
        } else {
          $.get('/api/dbRepos', function(data) {
            currentRepos = data;
            console.log(currentRepos);
  
            initializeRows(currentRepos);
          });
        }
      } catch (e) {
        console.error(e); // 💩
      }
    }
  
    // This function grabs tags from the database and updates the view
    function getTags() {
      $.get('/api/tags', function(data) {
        // Reassign the array
        tags = data;
  
        // Empty the tag div and then rebuild so we can see the new tags
        $('#tags').empty();
  
        // Display the tags on the page
        displayTags();
      });
    }
  
    // This function grabs all the repo tags, being called from within initializeRows, #57
    function getRepoTags(repoTags, repoID) {
      // Declare the array to hold the filtered tags
      let arrFilteredTags = [];
  
      // todo change Repo Tags repoID to integer so I don't have to use == onn line 295
      // strRepoID = toString(repoID);
  
      // Filter the tags
      const filteredRepoTags = repoTags.filter(tag => tag.repoID == repoID);
  
      // Filter the tags to each repo tag to get the info to display
      function filterTags(repoTagID) {
        // Covert to integer
        const intTagID = parseInt(repoTagID);
  
        // Filter the tags
        const filteredTags = tags.filter(tag => tag.id === intTagID);
  
        return filteredTags;
      }
  
      // Loop through the repo tags and get the matching tags
      for (let i = 0; i < filteredRepoTags.length; i++) {
        // Call the filter function
        const getFiltered = filterTags(filteredRepoTags[i].tagID);
  
        // Use the spread operator to combine arrays
        arrFilteredTags = [...arrFilteredTags, ...getFiltered];
      }
  
      return arrFilteredTags;
    }
  
    // This function inserts a new tag into our database and then updates the view
    function insertTag(repoID, tagID) {
      console.log('Add Repo Tag Called');
  
      // Create an object to pass in the route
      const tag = {
        repoID,
        tagID,
      };
  
      // Send the tag to route to be inserted
      $.post('/api/repotags', tag, getAllRepos).then(function(data) {
        console.log('From Post Repo Tags ', data);
      });
  
      // Close the popover
      $('.popover').hide();
    }
  
    // Call the async/await function to get the repos
    getAllRepos();
  
    // Call getTags to get tags on load
    getTags();
  
    // Tag Popover options
    const popOverSettings = {
      placement: 'auto',
      container: 'body',
      html: true,
      selector: '[rel="popover"]',
      content: $('#popTags'),
    };
  
    // Loads the popover options
    $('body').popover(popOverSettings);
  
    // Closes the popover when user clicks on the X
    $(document).on('click', '.popover .close', function(e) {
      e.preventDefault();
      $(this)
        .parents('.popover')
        .popover('hide');
    });
  
    // Assign Tag Button Clicked
    $(document).on('click', '.btnAssign', function() {
      // Makes div with the popover contents visible (initially hidden)
      $('#popTags').css('visibility', 'visible');
      console.log('btnAssign clicked');
      repoID = $(this).attr('id');
      console.log('Assign Tag Click with repo ID', repoID);
    });
  
    // Add Tag Button Clicked
    $(document).on('click', '.btnAdd', function(e) {
      console.log('btnAdd clicked');
      e.preventDefault();
      console.log('Add Tag Click');
      const tag = prompt('Please enter a new Tag Name');
      if (tag != null) {
        console.log(tag);
  
        const objTag = {
          tagName: tag.trim(),
          tagColor: '#00FFFF',
        };
  
        // Send value to the post route to add the tag to the db
        // Send the tag to route to be inserted
        $.post('/api/tag', objTag).then(function(data) {
          console.log(data);
  
          // Call the getTags function to display the new tag
          getTags();
        });
      }
    });
  
    // Popover Tag clicked to Assign
    $(document).on('click', '.popTag', function(e) {
      e.preventDefault();
      console.log('Pop Tag clicked');
  
      // Get the tagID
      const tagID = $(this).attr('id');
      console.log(tagID);
  
      // Get the repoID, set when click on Add Tag
      console.log(repoID);
  
      // Call insertTag to save this tag
      insertTag(repoID, tagID);
    });
  
    // Repo Tag clicked to Delete
    $(document).on('click', '.btnRepoTags', function(e) {
      e.preventDefault();
      console.log('Repo Tag clicked');
      console.log($(this).attr('data-id'));
  
      // Get the tagID
      const tagID = $(this).attr('data-id');
  
      $.ajax({
        method: 'DELETE',
        url: `/api/repotags/${tagID}`,
      }).then(function(dbRepoTags) {
        console.log('Response from delete', dbRepoTags);
  
        // Call getAllRepos to remove the deleted repo tag
        getAllRepos();
      });
    });
  
    // Tag clicked, this opens the modal to Update/Delete
    $(document).on('click', '.tag', function(e) {
      console.log('Tag Clicked');
      e.preventDefault();
      const id = $(this).attr('id');
      const title = $(this).html();
  
      // Update the modal content
      $('.modal-title').html(`Update/Delete ${title}`);
  
      // Add the tagID attr to the buttons
      $('#btnSaveTag').attr('id', id);
      $('#btnDelTag').attr('id', id);
    });
  
    // Save clicked on Tag Modal
    $(document).on('click', '.btnSave', function() {
      console.log('Tag Save Clicked');
      const tagName = $('input[name="txtTagName"]')
        .val()
        .trim();
      console.log(tagName);
  
      const id = $(this).attr('id');
  
      const objTag = {
        tagName,
        id,
      };
  
      $.ajax({
        method: 'PUT',
        url: '/api/tags',
        data: objTag,
      }).then(function(data) {
        console.log('Data!!!!', data);
  
        // Close Modal
        $('#tagModal').modal('hide');
  
        // Call the function that displays the cards
        location.reload();
      });
    });
  
    // Delete clicked on Tag Modal
    $(document).on('click', '.btnDel', function() {
      console.log('Tag Delete Clicked');
  
      const id = $(this).attr('id');
  
      $.ajax({
        method: 'DELETE',
        url: `/api/tags/${id}`,
      }).then(function(dbTag) {
        console.log('Response from delete', dbTag);
  
        // Reload to see the changes
        location.reload();
      });
    });
  
    // Delete clicked on Tag Modal
    $(document).on('click', '.clear', function() {
      console.log('Clear Filter');
      // Reset the currentRepos to all
      currentRepos = dbRepos;
  
      // Call initializeRows to reset the view
      initializeRows(currentRepos);
    });
  
    function filterRepos(tagID) {
      console.log('Inside filterRepos');
      // console.log(tagID);
      // console.log('DB Repos', dbRepos);
  
      // Reset the currentRepos to all
      currentRepos = dbRepos;
  
      // Call initializeRows to reset the view
      initializeRows(currentRepos);
  
      // console.log('Current', currentRepos);
  
      // filter the repos to just the ones with the tagID hovered over
      // First get all the RepoTags with this tagID
      // console.log(repoTags);
      const filteredRepoTags = repoTags.filter(tag => tag.tagID === tagID);
      console.log('Filtered Repo Tags', filteredRepoTags);
  
      // Array to hold the filtered repos
      let filteredRepos = [];
  
      // Loop over the repoTags
      for (let i = 0; i < filteredRepoTags.length; i++) {
        // Filter the current repos array to just the ones that have the assigned tag
        const getFiltered = currentRepos.filter(
          repo => repo.id === filteredRepoTags[i].repoID
        );
  
        // Use the spread operator to combine arrays
        filteredRepos = [...filteredRepos, ...getFiltered];
      }
  
      console.log('Filtered Repos', filteredRepos);
  
      // Now set currentRepos to just the filtered ones
      currentRepos = filteredRepos;
  
      // Call initializeRows with the new current repos
      initializeRows(currentRepos);
    }
  
    // todo Need to consider hover on mobile
    // Function to filter repos on mouseenter
    $(document).on('mouseenter', '.tag', function() {
      // console.log(this.id);
      const tagID = this.id;
      // Call filter repos
      filterRepos(tagID);
    });
  }); // End Document ready
  