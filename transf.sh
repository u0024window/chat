#!/bin/bash

currentDir=$(pwd);
dist='/dist';
currentDir=$currentDir$dist;


targetDir='/Users/fmark/git/work/crm_trunk/web/src/main/webapp/app/imview';
noContain=("img" "font");

cpFile(){
	for file in `find $currentDir -d`; do
		if [[ -f $file ]]; 
		then
			flag=true;
			for i in ${noContain[@]}; do
				if [[ ${file/${i}//} != $file ]]; then
					flag=false;
					break;
				fi
			done

			if [[ $flag == true ]]; 
			then
				dir=$file;
				currentDirLength=${#currentDir};
				postFix=${dir:(currentDirLength)};
				currentFileTargetDir=$targetDir$postFix;
				cp $file $currentFileTargetDir;
			fi
		fi
		

	done
}

cpFile;

