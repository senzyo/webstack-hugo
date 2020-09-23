#!/bin/bash

script_path=$(readlink -f "$0")
parent_dir=$(dirname "$script_path")
yaml_file="$parent_dir/data/webstack.yml"

RED=$'\e[1;31m'
GREEN=$'\e[1;32m'
YELLOW=$'\e[1;33m'
CYAN=$'\e[1;36m'
NC=$'\e[0m'

if [ ! -f "$yaml_file" ]; then
	echo "${RED}[错误]${NC} webstack.yml 文件不存在"
	exit 1
fi

echo "${CYAN}[提示]${NC} ========== 开始检查重复的 URL ==========="

url_list=$(grep -oP '(?<=url:).*' "$yaml_file")
declare -A url_count

# shellcheck disable=SC2068
for url in ${url_list[@]}; do
	if [[ ${url_count[$url]} ]]; then
		((url_count[$url]++))
	else
		url_count[$url]=1
	fi
done

has_duplicates=false

for url in "${!url_count[@]}"; do
	count=${url_count[$url]}
	if [[ $count -gt 1 ]]; then
		echo "${CYAN}[提示] ${YELLOW}$url${NC} 出现 ${YELLOW}$count${NC} 次"
		has_duplicates=true
	fi
done

if ! $has_duplicates; then
	echo "${GREEN}[结果]${NC} 未找到重复的 URL"
fi

echo "${CYAN}[提示]${NC} ========== 开始检查 URL 连通性 =========="

max_concurrency=10
connect_timeout=10
max_time=15
user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"

results_file=$(mktemp)
trap 'rm -f "$results_file"' EXIT

check_url() {
	local entry="$1"
	local title="${entry%%$'\t'*}"
	local url="${entry#*$'\t'}"
	local output ec code effective
	output=$(curl -sSL -o /dev/null --compressed \
		--connect-timeout "$connect_timeout" --max-time "$max_time" \
		-A "$user_agent" \
		-H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
		-H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
		-H 'Sec-Ch-Ua: "Chromium";v="149", "Not_A Brand";v="24", "Google Chrome";v="149"' \
		-H 'Sec-Ch-Ua-Mobile: ?0' \
		-H 'Sec-Ch-Ua-Platform: "Linux"' \
		-H 'Sec-Fetch-Dest: document' \
		-H 'Sec-Fetch-Mode: navigate' \
		-H 'Sec-Fetch-Site: none' \
		-H 'Sec-Fetch-User: ?1' \
		-H 'Upgrade-Insecure-Requests: 1' \
		-w '%{http_code}\t%{url_effective}' "$url" 2>/dev/null)
	ec=$?
	code="${output%%$'\t'*}"
	effective="${output#*$'\t'}"
	if [ "$code" = "000" ] || [ "$code" -ge 400 ] 2>/dev/null; then
		echo "${RED}[不通] ${CYAN}$title${NC}: $url (HTTP $code/curl退出码 $ec)"
	elif [ "$effective" != "$url" ]; then
		echo "${YELLOW}[跳转] ${CYAN}$title${NC}: $url ${YELLOW}->${NC} $effective"
	fi
}
export -f check_url
export connect_timeout max_time user_agent results_file RED GREEN YELLOW CYAN NC

awk '
  /^[[:space:]]*- title:/ { sub(/^[[:space:]]*- title:[[:space:]]*/,""); gsub(/^"|"$/,""); title=$0; next }
  /^[[:space:]]*url:/     { sub(/^[[:space:]]*url:[[:space:]]*/,""); if(title!="") print title "\t" $0; title="" }
' "$yaml_file" |
	xargs -d '\n' -P "$max_concurrency" -I {} bash -c 'check_url "$1" >> "$results_file"' _ {}

if [ -s "$results_file" ]; then
	cat "$results_file"
	echo "${GREEN}[统计]${NC} 异常数: $(wc -l <"$results_file")"
fi
