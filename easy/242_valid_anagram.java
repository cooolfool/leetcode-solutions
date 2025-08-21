class Solution {
    public boolean isAnagram(String s, String t) {
        Map<Character,Integer> tMap=new HashMap<>();
        Map<Character,Integer> sMap=new HashMap<>();
        int tLen=t.length();
        int sLen=s.length();
        if(sLen!=tLen)
        return false;
        for(int i=0;i<sLen;i++){
            if(sMap.containsKey(s.charAt(i)))
                sMap.put(s.charAt(i),sMap.get(s.charAt(i))+1);
            else
                sMap.put(s.charAt(i),1);
        }

        for(int i=0;i<tLen;i++){
            if(sMap.containsKey(t.charAt(i)) && sMap.get(t.charAt(i))>0)
            sMap.put(t.charAt(i),sMap.get(t.charAt(i))-1);
            else return false;
        }
        return true;
    }
}