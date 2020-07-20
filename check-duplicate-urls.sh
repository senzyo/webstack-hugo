#!/bin/bash

script_path=$(readlink -f "$0")
parent_dir=$(dirname "$script_path")
yaml_file="$parent_dir/data/webstack.yml"

if [ ! -f "$yaml_file" ]; then
    echo "File does not exist."
    exit 1
fi

url_list=$(grep -oP '(?<=url:).*' $yaml_file)
declare -A url_count

for url in ${url_list[@]}; do
    if [[ ${url_count[$url]} ]]; then
        ((url_count[$url]++))
    else
        url_count[$url]=1
    fi
done

has_duplicates=false

for url in ${!url_count[@]}; do
    count=${url_count[$url]}
    if [[ $count -gt 1 ]]; then
        echo "$url appears $count times."
        has_duplicates=true
    fi
done

if ! $has_duplicates; then
    echo "No duplicate URLs were found."
fi
