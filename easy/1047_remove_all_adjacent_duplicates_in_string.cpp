class Solution {
public:
    string removeDuplicates(string S) {
        stack<char> s;
        string str;
        //str.push_back(S[0]);
        //s.push(S[0]);
        for(int i=0;i<S.size();i++)
        {
            if(str.size()==0 ) //S[i]!=str[str.size()-1])
            str.push_back(S[i]);
           // if(S[i]==s.top())
            else if(S[i]==str[str.size()-1])
                //str.pop();
                str.pop_back(); 
            else 
                str.push_back(S[i]);
        }
        return str;
    }
};