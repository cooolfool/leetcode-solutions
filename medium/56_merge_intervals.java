class Solution {
    public int[][] merge(int[][] intervals) {

        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List <int[]> list = Arrays.asList(intervals);
        int len = list.size();
        if(len<=1){
            return intervals;
        }
        List<int []> res = new ArrayList(); 
        int curr[] = intervals[0];
        for(int i = 1; i<len; i++){
            int next [] = list.get(i);
            if(curr[1]>=next[0]){
             curr[1] = Math.max(curr[1], next[1]);
            }
            else{
                res.add(curr);
                curr = next;
            }       
        } 
        res.add(curr);
        return res.stream().toArray(int[][]::new);
}}