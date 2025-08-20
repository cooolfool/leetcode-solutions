class Solution {
    public void setZeroes(int[][] matrix) {
        
        int n = matrix.length;
        int m = matrix[0].length;
        Set<Integer> xList = new HashSet<>();
        Set<Integer> yList = new HashSet<>();
        for(int i = 0;i < n;i++){
            for(int j = 0;j<m;j++){
                if(matrix[i][j]==0){
                    xList.add(i);
                    yList.add(j);
                }
            }
        }

         for(int i = 0;i < n;i++){
            for(int j = 0;j<m;j++){
                if(xList.contains(i) || yList.contains(j)){
                    matrix[i][j]=0;
                }
            }
         }

    }
}