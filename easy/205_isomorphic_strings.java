class Solution {
    public boolean isIsomorphic(String s, String t) {


            int length =  s.length();
            Map<Character,Character> map=new HashMap<>();
            Map<Character,Character> map1=new HashMap<>();

            for(int i=0;i<length;i++){
                if(map.containsKey(s.charAt(i))){
                    if(!map.get(s.charAt(i)).equals(t.charAt(i)))
                    return false;
                }
                else{
                    map.put(s.charAt(i),t.charAt(i));
                }
            }

            for(int i=0;i<length;i++){
                if(map1.containsKey(t.charAt(i))){
                    if(!map1.get(t.charAt(i)).equals(s.charAt(i)))
                    return false;
                }
                else{
                    map1.put(t.charAt(i),s.charAt(i));
                }
            }
            return true;












        // char[] chS = s.toCharArray();
        // Arrays.sort(chS);
        // char[] chT = t.toCharArray();
        // Arrays.sort(chT);
        // int countS=chS.length;
        // int distinctS=1;
        // int distinctT=1;
        // for(int i=1;i<countS;i++){
        //     if(chS[i]!=chS[i-1])
        //     distinctS++;
        //     if(chT[i]!=chT[i-1])
        //     distinctT++;
        // }
        // if(distinctS==distinctT)
        // return true;
        // else
        // return false;
    }
}