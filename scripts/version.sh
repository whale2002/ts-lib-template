ORIGIN="origin"
RELEASE_BRANCH=`git symbolic-ref --short -q HEAD`

verify_local_clean() {
  git diff --quiet || echo "本地仓库有尚未提交的代码"
  echo "本地仓库代码已提交！"
}

verify_release_branch() {
  if [[ $RELEASE_BRANCH == master ]]
  then
    echo "当前处于 $RELEASE_BRANCH 分支"
  else
    echo "只能在 master 分支执行发布"
  fi
}

bump_version() {
  npx changeset version
  echo "更新 changelog 成功!"
}

push() {
  git add .
  git commit -m "ci: release"
  git push origin $RELEASE_BRANCH
  echo "已提交到 origin/$RELEASE_BRANCH"
}

verify_local_clean
verify_release_branch
bump_version
push

exit 0