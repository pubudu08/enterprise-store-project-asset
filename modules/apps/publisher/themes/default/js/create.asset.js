$(function(){

	/*
	Creates a new asset
	*/

	//var id=$('#meta-asset-id').html();
	var type=$('#meta-asset-type').val();
	
		
		
		$('#btn-create-asset').on('click',function(){

            var vLocation = $('input[name=vcs]:checked').data('location');
            if(vLocation){
                var repoName =  $('input[name=svn-location]').val();
                var locationEndWith = endsWith(vLocation,'/');
                var repoStartsWith = startsWith(repoName,'/');
                if(locationEndWith){
                    vLocation = vLocation+  repoName
                } else if (repoStartsWith){
                    vLocation = vLocation+ repoName
                } else {
                    vLocation = vLocation+ '/' + repoName
                }
                $('input[name=other_versioncontrol]').val(vLocation)
            } else{
                alert('Please select one of the version control server');
                return false;
            }
            console.log('dsfsfsdfsdf')
            alert(vLocation);


            var cLocation = $('input[name=cis]:checked').data('location');
            if(cLocation){
                var repoName =  $('input[name=cis-location]').val();
                var locationEndWith = endsWith(cLocation,'/');
                var repoStartsWith = startsWith(repoName,'/');
                if(locationEndWith){
                    cLocation = cLocation+  repoName
                } else if (repoStartsWith){
                    cLocation = cLocation+ repoName
                } else {
                    cLocation = cLocation+ '/' + repoName
                }
                $('input[name=other_continuousintegration]').val(cLocation)
            } else{
                //alert(cLocation)
            }

            var pLocation = $('input[name=pms]:checked').data('location');
            if(pLocation){
                var repoName =  $('input[name=pms-location]').val();
                var locationEndWith = endsWith(pLocation,'/');
                var repoStartsWith = startsWith(repoName,'/');
                if(locationEndWith){
                    pLocation = pLocation+  repoName
                } else if (repoStartsWith){
                    pLocation = pLocation+ repoName
                } else {
                    pLocation = pLocation+ '/' + repoName
                }
                $('input[name=other_projectmanagementtool]').val(pLocation)
            } else{
                //alert(pLocation)
            }

            var iLocation = $('input[name=iss]:checked').data('location');
            if(iLocation){
                var repoName =  $('input[name=iss-location]').val();
                var locationEndWith = endsWith(iLocation,'/');
                var repoStartsWith = startsWith(repoName,'/');
                if(locationEndWith){
                    iLocation = iLocation+  repoName
                } else if (repoStartsWith){
                    iLocation = iLocation+ repoName
                } else {
                    iLocation = iLocation+ '/' + repoName
                }
                $('input[name=other_issuetracker]').val(iLocation)
            } else{
                //alert(iLocation)
            }


			var fields=$('#form-asset-create :input');
			var data={};
			fields.each(function(){
				if(this.type!='button')
				{
					//console.log(this.value);
					data[this.id]=this.value;
				}
			});

			$.ajax({
				url:'/publisher/asset/'+type,
				type:'POST',
				data: data,
				success:function(response){
					alert('asset added.');
					window.location='/publisher/assets/'+type+'/';
				},
				error:function(response){
					alert('Failed to add asset.');
				}
			});



			//$.post('/publisher/asset/'+type, data);

		});

    $('#btn-create-project').on('click',function(){

        alert('fsdsfsdafsdfsdf');

        var fields=$('#form-asset-create :input');
        var data={};
        fields.each(function(){
            if(this.type!='button')
            {
                //console.log(this.value);
                data[this.id]=this.value;
            }
        });

        $.ajax({
            url:'/publisher/asset/'+type,
            type:'POST',
            data: data,
            success:function(response){
                alert('asset added.');
                window.location='/publisher/assets/'+type+'/';
            },
            error:function(response){
                alert('Failed to add asset.');
            }
        });



        //$.post('/publisher/asset/'+type, data);

    });
	//}
	
	
});
